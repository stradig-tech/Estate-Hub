#!/bin/bash
exec > /home/admin-estatehub/htdocs/admin.estatehub.stradigtech.com/setup.log 2>&1

echo "=== 1. Starting setup at $(date) ==="
cd /home/admin-estatehub/htdocs/admin.estatehub.stradigtech.com

export PATH="$HOME/.local/bin:$PATH"

# Ensure PyMySQL hook is in __init__.py
cat << 'EOF' > /home/admin-estatehub/htdocs/admin.estatehub.stradigtech.com/estate_flow_backend/__init__.py
try:
    import pymysql
    pymysql.version_info = (2, 2, 1, 'final', 0)
    pymysql.install_as_MySQLdb()
except ImportError:
    pass
EOF

echo "=== 2. Installing WhiteNoise ==="
python3 -m pip install --user whitenoise || pip3 install --user whitenoise || true

echo "=== 3. Collecting Static Files ==="
python3 manage.py collectstatic --noinput || true

echo "=== 4. Testing WSGI Application Import ==="
python3 -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate_flow_backend.settings')
django.setup()
from django.core.wsgi import get_wsgi_application
try:
    app = get_wsgi_application()
    print('DJANGO WSGI APPLICATION LOADED: SUCCESS!')
except Exception as e:
    import traceback
    print('DJANGO WSGI APPLICATION LOAD: FAILED!')
    traceback.print_exc()
"

echo "=== 5. Restarting Gunicorn on Port 8093 ==="
pkill -f "8093" || true
sleep 1

nohup python3 -m gunicorn estate_flow_backend.wsgi:application --bind 127.0.0.1:8093 --workers 3 > /home/admin-estatehub/htdocs/admin.estatehub.stradigtech.com/gunicorn.log 2>&1 &

sleep 4

echo "=== 6. Checking Port 8093 ==="
curl -I http://127.0.0.1:8093/admin/ || true

echo "=== 7. Recent Gunicorn Logs ==="
tail -n 25 /home/admin-estatehub/htdocs/admin.estatehub.stradigtech.com/gunicorn.log || true

echo "=== 8. Done at $(date) ==="
