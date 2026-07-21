import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import AppLayout from '@/components/Layout/AppLayout';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import AgentProfile from './pages/AgentProfile';
import Dashboard from './pages/Dashboard';
import SubmitProperty from './pages/SubmitProperty';
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import DashboardProfile from './pages/DashboardProfile';
import DashboardProperties from './pages/DashboardProperties';
import DashboardFavorites from './pages/DashboardFavorites';
import DashboardReviews from './pages/DashboardReviews';
import DashboardMessages from './pages/DashboardMessages';
import DynamicPage from './pages/DynamicPage';
import DashboardPlaceholder from './pages/DashboardPlaceholder';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

    // Show loading spinner while checking app public settings or auth
    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Handle authentication errors
    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        } else if (authError.type === 'auth_required') {
            // Redirect to login automatically
            navigateToLogin();
            return null;
        }
    }

    // Render the main app
    return (
        <Routes>
            {/* Add your page Route elements here */}
            <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/agents/:id" element={<AgentProfile />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/privacy-policy" element={<DynamicPage slugProp="privacy-policy" />} />
                <Route path="/terms" element={<DynamicPage slugProp="terms" />} />
            </Route>
            {/* Dashboard Routes */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/submit-property" element={<SubmitProperty />} />
                <Route path="/dashboard/properties/:id" element={<PropertyDetail />} />
                {/* Dashboard Pages */}
                <Route path="/dashboard/profile" element={<DashboardProfile />} />
                <Route path="/dashboard/reviews" element={<DashboardReviews />} />
                <Route path="/dashboard/properties" element={<DashboardProperties />} />
                <Route path="/dashboard/favorites" element={<DashboardFavorites />} />
                <Route path="/dashboard/messages" element={<DashboardMessages />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};


import FloatingScrollButton from './components/FloatingScrollButton';

function App() {

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <ScrollToTop />
                    <FloatingScrollButton />
                    <AuthenticatedApp />
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App