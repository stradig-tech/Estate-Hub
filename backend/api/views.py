import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """Upload a file (property image, floor plan, avatar) and return its public URL."""
    file_obj = request.FILES.get('file') or request.FILES.get('image')
    if not file_obj:
        return Response({'error': 'No file uploaded under field "file" or "image"'}, status=status.HTTP_400_BAD_REQUEST)

    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return Response(
            {'error': f'Unsupported file type "{ext}". Allowed types: {", ".join(sorted(ALLOWED_EXTENSIONS))}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Max 15MB limit
    if file_obj.size > 15 * 1024 * 1024:
        return Response({'error': 'File size exceeds maximum 15MB limit'}, status=status.HTTP_400_BAD_REQUEST)

    filename = f"uploads/{uuid.uuid4().hex}{ext}"
    saved_path = default_storage.save(filename, ContentFile(file_obj.read()))
    media_url = f"{settings.MEDIA_URL.rstrip('/')}/{saved_path.lstrip('/')}"
    full_url = request.build_absolute_uri(media_url)

    return Response({
        'url': full_url,
        'file_url': full_url,
        'path': media_url,
        'name': file_obj.name,
    }, status=status.HTTP_201_CREATED)
