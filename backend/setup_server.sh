#!/bin/bash
set -e

SITE_DIR="/home/admin-estatehub/htdocs/admin.estatehub.stradigtech.com"
cd "$SITE_DIR"

echo "=== 1. Setting up Python Virtual Environment ==="
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

echo "=== 2. Installing dependencies ==="
pip install --upgrade pip
pip install -r requirements.txt

echo "=== 3. Collecting static files ==="
python manage.py collectstatic --noinput

echo "=== 4. Starting Gunicorn on Port 8093 ==="
pkill -f "8093" || true

gunicorn estate_flow_backend.wsgi:application \
    --bind 127.0.0.1:8093 \
    --workers 3 \
    --timeout 120 \
    --daemon

echo "=== 5. Verification ==="
sleep 2
curl -I http://127.0.0.1:8093/admin/ || true

echo "=== Done! EstateHub Django is running on port 8093 ==="
