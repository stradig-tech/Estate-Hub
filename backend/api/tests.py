"""Phase 0 security regression tests: role escalation, ownership, privacy, inquiries, billing."""
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from billing.models import Invoice
from properties.models import Property
from support.models import Inquiry

User = get_user_model()
PASSWORD = 'S3cure-pass-123!'


def make_user(email, role='buyer', **extra):
    return User.objects.create_user(username=email, email=email, password=PASSWORD, role=role, **extra)


def make_property(agent, status_='active', **extra):
    data = dict(title='Nice house', price=100000, city='Dhaka', state='DH',
                listing_type='for_sale', property_type='house')
    data.update(extra)
    return Property.objects.create(agent=agent, status=status_, **data)


def rows(response):
    """Return result rows whether or not the endpoint is paginated."""
    data = response.data
    return data['results'] if isinstance(data, dict) and 'results' in data else data


@override_settings(PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class ApiTestBase(APITestCase):
    def setUp(self):
        cache.clear()  # throttle counters live in the cache
        self.admin = make_user('admin@example.com', 'admin')
        self.agent = make_user('agent@example.com', 'agent', first_name='Ann', last_name='Agent')
        self.other_agent = make_user('agent2@example.com', 'agent')
        self.buyer = make_user('buyer@example.com', 'buyer')

    def login(self, user):
        self.client.force_authenticate(user)


class AuthTests(ApiTestBase):
    def test_register_defaults_to_buyer_and_ignores_admin_role(self):
        res = self.client.post('/api/auth/register/', {
            'email': 'New@Example.com', 'password': PASSWORD, 'role': 'admin'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)  # 'admin' is not a valid choice

        res = self.client.post('/api/auth/register/', {
            'email': 'New@Example.com', 'password': PASSWORD}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['user']['role'], 'buyer')
        self.assertEqual(res.data['user']['email'], 'new@example.com')

    def test_register_agent_role_and_name(self):
        res = self.client.post('/api/auth/register/', {
            'email': 'a@example.com', 'password': PASSWORD, 'role': 'agent',
            'full_name': 'Jane Doe'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['user']['role'], 'agent')
        self.assertEqual(res.data['user']['full_name'], 'Jane Doe')

    def test_register_agent_with_brokerage_fields(self):
        res = self.client.post('/api/auth/register/', {
            'email': 'agent.pro@example.com',
            'password': PASSWORD,
            'role': 'agent',
            'full_name': 'Sarah Connor',
            'phone': '+1-555-0199',
            'agency_name': 'Independent',
            'license_number': 'LIC-998877',
            'bio': 'Top luxury real estate specialist.',
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['user']['agent_status'], 'pending')
        user = User.objects.get(email='agent.pro@example.com')
        self.assertEqual(user.role, 'agent')
        self.assertEqual(user.agent_status, 'pending')
        self.assertEqual(user.first_name, 'Sarah')
        self.assertEqual(user.last_name, 'Connor')
        self.assertEqual(user.phone, '+1-555-0199')
        self.assertEqual(user.agency_name, 'Independent')
        self.assertEqual(user.license_number, 'LIC-998877')
        self.assertEqual(user.bio, 'Top luxury real estate specialist.')

    def test_unapproved_agent_cannot_create_property(self):
        pending_agent = make_user('pending.agent@example.com', role='agent', agent_status='pending')
        self.login(pending_agent)
        res = self.client.post('/api/properties/', {
            'title': 'Blocked house', 'price': '300000', 'listing_type': 'for_sale',
            'property_type': 'house', 'city': 'Dhaka', 'state': 'DH'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # After approval, agent can create properties
        pending_agent.agent_status = 'approved'
        pending_agent.save()
        res = self.client.post('/api/properties/', {
            'title': 'Approved house', 'price': '300000', 'listing_type': 'for_sale',
            'property_type': 'house', 'city': 'Dhaka', 'state': 'DH'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_superuser_assigns_admin_role(self):
        su = User.objects.create_superuser(
            username='cli_admin',
            email='cli_admin@example.com',
            password=PASSWORD
        )
        self.assertTrue(su.is_superuser)
        self.assertTrue(su.is_staff)
        self.assertEqual(su.role, 'admin')

    def test_register_rejects_weak_password_and_duplicates(self):
        res = self.client.post('/api/auth/register/', {'email': 'x@example.com', 'password': '123'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        res = self.client.post('/api/auth/register/', {
            'email': 'BUYER@example.com', 'password': PASSWORD}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_cannot_escalate_privileges(self):
        self.login(self.buyer)
        res = self.client.patch('/api/auth/me/', {
            'role': 'admin', 'subscription_plan': 'Agency', 'subscription_status': 'active',
            'email': 'hacker@example.com', 'phone': '555-1234'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.buyer.refresh_from_db()
        self.assertEqual(self.buyer.role, 'buyer')
        self.assertEqual(self.buyer.subscription_plan, 'Free')
        self.assertEqual(self.buyer.subscription_status, 'free')
        self.assertEqual(self.buyer.email, 'buyer@example.com')
        self.assertEqual(self.buyer.phone, '555-1234')  # profile fields still editable


class UserPrivacyTests(ApiTestBase):
    def test_users_endpoint_is_admin_only(self):
        self.assertEqual(self.client.get('/api/users/').status_code, status.HTTP_401_UNAUTHORIZED)
        self.login(self.buyer)
        self.assertEqual(self.client.get('/api/users/').status_code, status.HTTP_403_FORBIDDEN)
        self.login(self.admin)
        self.assertEqual(self.client.get('/api/users/').status_code, status.HTTP_200_OK)

    def test_public_agents_hide_contact_details(self):
        res = self.client.get(f'/api/agents/{self.agent.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['full_name'], 'Ann Agent')
        for private in ('email', 'phone', 'license_number', 'role'):
            self.assertNotIn(private, res.data)
        # buyers/admins are not listed as agents
        self.assertEqual(self.client.get(f'/api/agents/{self.buyer.id}/').status_code, status.HTTP_404_NOT_FOUND)

    def test_unapproved_agent_hidden_from_public_directory(self):
        unapproved = make_user('unapproved@example.com', role='agent', agent_status='pending')
        self.assertEqual(self.client.get(f'/api/agents/{unapproved.id}/').status_code, status.HTTP_404_NOT_FOUND)


class PropertyTests(ApiTestBase):
    def payload(self, **extra):
        data = {'title': 'New listing', 'price': '250000', 'listing_type': 'for_sale',
                'property_type': 'condo', 'city': 'Dhaka', 'state': 'DH'}
        data.update(extra)
        return data

    def test_public_only_sees_active(self):
        active = make_property(self.agent)
        make_property(self.agent, 'pending')
        make_property(self.agent, 'rejected')
        res = self.client.get('/api/properties/')
        self.assertEqual([p['id'] for p in res.data['results']], [str(active.id)])
        # explicitly asking for pending still returns nothing for the public
        self.assertEqual(self.client.get('/api/properties/?status=pending').data['count'], 0)

    def test_pending_detail_hidden_from_public_visible_to_owner_and_admin(self):
        pending = make_property(self.agent, 'pending')
        url = f'/api/properties/{pending.id}/'
        self.assertEqual(self.client.get(url).status_code, status.HTTP_404_NOT_FOUND)
        self.login(self.other_agent)
        self.assertEqual(self.client.get(url).status_code, status.HTTP_404_NOT_FOUND)
        self.login(self.agent)
        self.assertEqual(self.client.get(url).status_code, status.HTTP_200_OK)
        self.login(self.admin)
        self.assertEqual(self.client.get(url).status_code, status.HTTP_200_OK)

    def test_buyer_and_anonymous_cannot_create(self):
        self.assertEqual(self.client.post('/api/properties/', self.payload(), format='json').status_code,
                         status.HTTP_401_UNAUTHORIZED)
        self.login(self.buyer)
        self.assertEqual(self.client.post('/api/properties/', self.payload(), format='json').status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_agent_listing_is_forced_to_pending_and_owned(self):
        self.login(self.agent)
        res = self.client.post('/api/properties/', self.payload(
            status='active', featured=True, views=999, agent_id=str(self.admin.id)), format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)
        prop = Property.objects.get(id=res.data['id'])
        self.assertEqual(prop.status, 'pending')
        self.assertFalse(prop.featured)
        self.assertEqual(prop.views, 0)
        self.assertEqual(prop.agent, self.agent)
        self.assertEqual(prop.agent_name, 'Ann Agent')

    def test_agent_cannot_self_approve_or_edit_others(self):
        prop = make_property(self.agent, 'pending')
        self.login(self.agent)
        res = self.client.patch(f'/api/properties/{prop.id}/', {'status': 'active', 'title': 'Edited'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        prop.refresh_from_db()
        self.assertEqual(prop.status, 'pending')
        self.assertEqual(prop.title, 'Edited')

        active = make_property(self.agent, 'active')
        self.login(self.other_agent)
        self.assertEqual(self.client.patch(f'/api/properties/{active.id}/', {'title': 'x'}, format='json').status_code,
                         status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.delete(f'/api/properties/{active.id}/').status_code, status.HTTP_403_FORBIDDEN)

    def test_buyer_cannot_modify_property(self):
        active = make_property(self.agent)
        self.login(self.buyer)
        self.assertEqual(self.client.patch(f'/api/properties/{active.id}/', {'title': 'x'}, format='json').status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_admin_can_approve_and_reject(self):
        prop = make_property(self.agent, 'pending')
        self.login(self.admin)
        res = self.client.patch(f'/api/properties/{prop.id}/', {'status': 'active'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res = self.client.patch(f'/api/properties/{prop.id}/', {
            'status': 'rejected', 'rejection_note': 'Bad photos'}, format='json')
        prop.refresh_from_db()
        self.assertEqual((prop.status, prop.rejection_note), ('rejected', 'Bad photos'))

    def test_editing_rejected_listing_resubmits_it(self):
        prop = make_property(self.agent, 'rejected')
        self.login(self.agent)
        self.client.patch(f'/api/properties/{prop.id}/', {'title': 'Fixed'}, format='json')
        prop.refresh_from_db()
        self.assertEqual(prop.status, 'pending')

    def test_filters_and_pagination(self):
        make_property(self.agent, price=100, bedrooms=1, title='Cheap flat')
        make_property(self.agent, price=900, bedrooms=4, title='Big villa')
        res = self.client.get('/api/properties/?min_price=500')
        self.assertEqual([p['title'] for p in res.data['results']], ['Big villa'])
        res = self.client.get('/api/properties/?q=flat&min_price=abc')  # invalid number ignored
        self.assertEqual([p['title'] for p in res.data['results']], ['Cheap flat'])
        res = self.client.get('/api/properties/?ordering=price&limit=1')
        self.assertEqual(len(res.data['results']), 1)
        self.assertEqual(res.data['count'], 2)
        self.assertEqual(res.data['results'][0]['title'], 'Cheap flat')

    def test_view_counter_is_server_side(self):
        prop = make_property(self.agent)
        self.assertEqual(self.client.patch(f'/api/properties/{prop.id}/', {'views': 5}, format='json').status_code,
                         status.HTTP_401_UNAUTHORIZED)
        res = self.client.post(f'/api/properties/{prop.id}/view/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['views'], 1)
        self.login(self.agent)  # owner views do not count
        self.assertEqual(self.client.post(f'/api/properties/{prop.id}/view/').data['views'], 1)

    def test_nearby_place_requires_ownership(self):
        prop = make_property(self.agent)
        body = {'name': 'School', 'type': 'school', 'distance': '1km', 'property': str(prop.id)}
        self.login(self.other_agent)
        self.assertEqual(self.client.post('/api/nearby-places/', body, format='json').status_code,
                         status.HTTP_403_FORBIDDEN)
        self.login(self.agent)
        self.assertEqual(self.client.post('/api/nearby-places/', body, format='json').status_code,
                         status.HTTP_201_CREATED)


class InquiryTests(ApiTestBase):
    def test_guest_can_send_inquiry_and_agent_is_derived(self):
        prop = make_property(self.agent)
        res = self.client.post('/api/inquiries/', {
            'name': 'Guest', 'email': 'guest@example.com', 'message': 'Hello',
            'property_id': str(prop.id), 'agent_id': str(self.other_agent.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.property, prop)
        self.assertEqual(inquiry.agent, self.agent)  # client-supplied agent_id is ignored
        self.assertEqual(inquiry.status, 'new')

    def test_guest_cannot_inquire_about_inactive_property(self):
        prop = make_property(self.agent, 'pending')
        res = self.client.post('/api/inquiries/', {
            'name': 'Guest', 'email': 'g@example.com', 'message': 'Hi', 'property_id': str(prop.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_inquiries_are_scoped(self):
        prop = make_property(self.agent)
        Inquiry.objects.create(name='A', email='a@x.com', message='m', property=prop, agent=self.agent)
        Inquiry.objects.create(name='B', email='b@x.com', message='m', agent=self.other_agent)
        Inquiry.objects.create(name='Buyer', email=self.buyer.email, message='m', agent=self.other_agent)

        self.assertEqual(self.client.get('/api/inquiries/').status_code, status.HTTP_401_UNAUTHORIZED)

        def names(user):
            self.login(user)
            return sorted(i['name'] for i in rows(self.client.get('/api/inquiries/')))

        self.assertEqual(names(self.agent), ['A'])
        self.assertEqual(names(self.other_agent), ['B', 'Buyer'])
        self.assertEqual(names(self.buyer), ['Buyer'])
        self.assertEqual(names(self.admin), ['A', 'B', 'Buyer'])

    def test_only_receiving_agent_can_update_status(self):
        inquiry = Inquiry.objects.create(name='A', email='a@x.com', message='m', agent=self.agent)
        url = f'/api/inquiries/{inquiry.id}/'
        self.login(self.other_agent)
        self.assertEqual(self.client.patch(url, {'status': 'read'}, format='json').status_code,
                         status.HTTP_404_NOT_FOUND)
        self.login(self.agent)
        self.assertEqual(self.client.patch(url, {'status': 'read', 'message': 'tamper'}, format='json').status_code,
                         status.HTTP_200_OK)
    def test_agent_and_customer_can_message_each_other(self):
        prop = make_property(self.agent)
        inquiry = Inquiry.objects.create(
            name='Buyer', email=self.buyer.email, message='Interested in viewing', property=prop, agent=self.agent, customer=self.buyer
        )
        reply_url = f'/api/inquiries/{inquiry.id}/reply/'

        # 1. Agent sends reply to customer
        self.login(self.agent)
        res = self.client.post(reply_url, {'message': 'Hello Buyer! Let us schedule for tomorrow.'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(res.data['messages']), 1)
        self.assertEqual(res.data['messages'][0]['sender_role'], 'agent')
        self.assertEqual(res.data['status'], 'replied')

        # 2. Customer sends reply back to agent
        self.login(self.buyer)
        res = self.client.post(reply_url, {'message': 'Tomorrow at 2pm works great!'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(res.data['messages']), 2)
        self.assertEqual(res.data['messages'][1]['sender_role'], 'customer')

        # 3. Third party cannot message in this conversation
        self.login(self.other_agent)
        res = self.client.post(reply_url, {'message': 'Intruder message'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)


class FavoriteReviewTests(ApiTestBase):
    def test_favorites_alias_duplicates_and_scoping(self):
        prop = make_property(self.agent)
        self.login(self.buyer)
        res = self.client.post('/api/favorites/', {'property_id': str(prop.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)
        self.assertEqual(str(res.data['property_id']), str(prop.id))
        self.assertEqual(res.data['property_title'], prop.title)
        self.assertEqual(self.client.post('/api/favorites/', {'property_id': str(prop.id)}, format='json').status_code,
                         status.HTTP_400_BAD_REQUEST)
        self.login(self.other_agent)
        self.assertEqual(len(rows(self.client.get('/api/favorites/'))), 0)

    def test_review_identity_rating_and_ownership(self):
        self.login(self.buyer)
        bad = self.client.post('/api/reviews/', {'agent_id': str(self.agent.id), 'rating': 9, 'comment': 'x'}, format='json')
        self.assertEqual(bad.status_code, status.HTTP_400_BAD_REQUEST)
        res = self.client.post('/api/reviews/', {
            'agent_id': str(self.agent.id), 'rating': 5, 'comment': 'Great',
            'author_name': 'Fake', 'author_email': 'fake@example.com'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)
        self.assertEqual(res.data['author_email'], self.buyer.email)
        self.assertNotEqual(res.data['author_name'], 'Fake')
        # duplicate review for the same agent is rejected
        self.assertEqual(self.client.post('/api/reviews/', {
            'agent_id': str(self.agent.id), 'rating': 4, 'comment': 'again'}, format='json').status_code,
            status.HTTP_400_BAD_REQUEST)
        # someone else cannot edit/delete it
        url = f"/api/reviews/{res.data['id']}/"
        self.login(self.other_agent)
        self.assertEqual(self.client.delete(url).status_code, status.HTTP_403_FORBIDDEN)
        self.login(self.buyer)
        self.assertEqual(self.client.patch(url, {'comment': 'Updated'}, format='json').status_code, status.HTTP_200_OK)

    def test_cannot_review_self(self):
        self.login(self.agent)
        res = self.client.post('/api/reviews/', {'agent_id': str(self.agent.id), 'rating': 5, 'comment': 'me'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class BillingTests(ApiTestBase):
    def test_users_cannot_create_invoices_or_edit_plans(self):
        body = {'amount': '49.00', 'plan_name': 'Pro', 'status': 'paid'}
        self.login(self.agent)
        self.assertEqual(self.client.post('/api/invoices/', body, format='json').status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.post('/api/subscription-plans/', {
            'name': 'Free+', 'price': '0', 'features': []}, format='json').status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_manage_and_users_only_see_own_invoices(self):
        self.login(self.admin)
        self.assertEqual(self.client.post('/api/invoices/', {
            'amount': '49.00', 'plan_name': 'Pro', 'status': 'paid', 'user': str(self.agent.id)},
            format='json').status_code, status.HTTP_201_CREATED)
        self.assertEqual(Invoice.objects.count(), 1)
        self.login(self.agent)
        self.assertEqual(len(rows(self.client.get('/api/invoices/'))), 1)
        self.login(self.other_agent)
        self.assertEqual(len(rows(self.client.get('/api/invoices/'))), 0)


class AdminPanelTests(ApiTestBase):
    """Smoke tests for the Jazzmin-powered Django admin."""

    def make_root(self, email):
        return User.objects.create_superuser(email, email, PASSWORD)

    def test_superuser_gets_admin_role(self):
        self.assertEqual(self.make_root('root@example.com').role, 'admin')

    def test_every_admin_page_renders(self):
        from django.contrib import admin as django_admin
        root = self.make_root('root2@example.com')
        prop = make_property(self.agent, 'pending')
        self.client.force_login(root)
        self.assertEqual(self.client.get('/admin/').status_code, 200)
        for model in django_admin.site._registry:
            meta = model._meta
            base = f'/admin/{meta.app_label}/{meta.model_name}/'
            self.assertEqual(self.client.get(base).status_code, 200, base)
            self.assertEqual(self.client.get(base + 'add/').status_code, 200, base + 'add/')
        self.assertEqual(self.client.get(f'/admin/properties/property/{prop.pk}/change/').status_code, 200)
        self.assertEqual(self.client.get(f'/admin/accounts/user/{self.agent.pk}/change/').status_code, 200)

    def test_bulk_approve_action(self):
        root = self.make_root('root3@example.com')
        prop = make_property(self.agent, 'pending')
        self.client.force_login(root)
        res = self.client.post('/admin/properties/property/', {
            'action': 'approve', '_selected_action': [str(prop.pk)]})
        self.assertEqual(res.status_code, 302)
        prop.refresh_from_db()
        self.assertEqual(prop.status, 'active')

    def test_admin_requires_staff(self):
        self.client.force_login(self.buyer)
        self.assertEqual(self.client.get('/admin/').status_code, 302)  # redirected to login

