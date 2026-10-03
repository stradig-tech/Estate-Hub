from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """`?page=N&limit=M` (the frontend already sends `limit`)."""
    page_size = 50
    page_size_query_param = 'limit'
    max_page_size = 100
