# Deployment Guide

## Prerequisites

### System Requirements
- Windows OS (for SecuGen SDK compatibility)
- Python 3.8 or higher
- Node.js 16.x or higher
- PostgreSQL 12 or higher
- SecuGen fingerprint reader device
- SecuGen FDx SDK Pro for Windows v4.3.1

### Hardware Requirements
- SecuGen USB fingerprint reader
- USB port for device connection
- Minimum 4GB RAM
- 10GB available disk space

## Development Environment Setup

### 1. Database Setup

#### Install PostgreSQL
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run installer and set password for postgres user
3. Ensure PostgreSQL service is running

#### Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE finger_db;

-- Verify database creation
\l
```

### 2. Backend Setup

#### Navigate to Backend Directory
```cmd
cd backend
```

#### Create Virtual Environment
```cmd
python -m venv venv
```

#### Activate Virtual Environment
```cmd
venv\Scripts\activate
```

#### Install Dependencies
```cmd
pip install -r requirements.txt
```

#### Configure Database
Edit `backend/fingerprint_api/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'finger_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',  # Change this
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### Run Migrations
```cmd
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser (Optional)
```cmd
python manage.py createsuperuser
```

#### Start Development Server
```cmd
python manage.py runserver
```

Backend will be available at: http://localhost:8000

### 3. Frontend Setup

#### Navigate to Frontend Directory
```cmd
cd frontend
```

#### Install Dependencies
```cmd
npm install
```

#### Configure API Endpoint
Verify `frontend/src/services/api.js` has correct backend URL:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

#### Start Development Server
```cmd
npm run dev
```

Frontend will be available at: http://localhost:5173

### 4. SecuGen SDK Setup

#### Install SDK
1. Navigate to `secugen/FDx SDK Pro for Windows v4.3.1_J1.12/`
2. Run the SDK installer
3. Connect SecuGen fingerprint reader to USB port
4. Verify device is recognized in Device Manager

#### Copy DLL Files
Copy appropriate DLL based on system architecture:

For 64-bit systems:
```cmd
copy "secugen\FDx SDK Pro for Windows v4.3.1_J1.12\FDx SDK Pro for Windows v4.3.1\DotNET\Bin\x64\SecuGen.FDxSDKPro.DotNet.Windows.dll" frontend\public\
```

For 32-bit systems:
```cmd
copy "secugen\FDx SDK Pro for Windows v4.3.1_J1.12\FDx SDK Pro for Windows v4.3.1\DotNET\Bin\i386\SecuGen.FDxSDKPro.DotNet.Windows.dll" frontend\public\
```

## Production Deployment

### 1. Backend Production Setup

#### Update Django Settings
Create `backend/fingerprint_api/settings_prod.py`:
```python
from .settings import *

DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'your-server-ip']

SECRET_KEY = 'generate-a-secure-random-key-here'

# Database - use environment variables
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'finger_db'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# CORS - restrict to your frontend domain
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```

#### Collect Static Files
```cmd
python manage.py collectstatic --noinput
```

#### Use Production Server (Gunicorn)
```cmd
pip install gunicorn
gunicorn fingerprint_api.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### 2. Frontend Production Build

#### Build for Production
```cmd
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

#### Serve with Web Server
Use IIS, Nginx, or Apache to serve the `dist` folder.

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Database Production Setup

#### Secure PostgreSQL
```sql
-- Create dedicated database user
CREATE USER fingerprint_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE finger_db TO fingerprint_user;

-- Connect to finger_db
\c finger_db

-- Grant table privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fingerprint_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fingerprint_user;
```

#### Configure PostgreSQL for Remote Access (if needed)
Edit `postgresql.conf`:
```
listen_addresses = 'localhost'  # Keep localhost for security
```

Edit `pg_hba.conf`:
```
# Local connections only
host    finger_db    fingerprint_user    127.0.0.1/32    md5
```

### 4. Windows Service Setup (Optional)

#### Create Backend Service
Use NSSM (Non-Sucking Service Manager):
```cmd
nssm install FingerprintAPI "C:\path\to\venv\Scripts\python.exe" "C:\path\to\manage.py runserver 0.0.0.0:8000"
nssm start FingerprintAPI
```

## Environment Variables

Create `.env` file in backend directory:
```env
DEBUG=False
SECRET_KEY=your-secret-key-here
DB_NAME=finger_db
DB_USER=fingerprint_user
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=your-domain.com,your-ip
```

Install python-decouple:
```cmd
pip install python-decouple
```

Update settings.py to use environment variables:
```python
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
```

## Backup and Recovery

### Database Backup
```cmd
pg_dump -U postgres -d finger_db -F c -f backup_finger_db.dump
```

### Database Restore
```cmd
pg_restore -U postgres -d finger_db -c backup_finger_db.dump
```

### Automated Backup Script (Windows)
Create `backup.bat`:
```batch
@echo off
set BACKUP_DIR=C:\backups\fingerprint
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

pg_dump -U postgres -d finger_db -F c -f "%BACKUP_DIR%\finger_db_%TIMESTAMP%.dump"

echo Backup completed: finger_db_%TIMESTAMP%.dump
```

Schedule with Windows Task Scheduler for daily backups.

## Monitoring and Logging

### Django Logging Configuration
Add to `settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Create Logs Directory
```cmd
mkdir logs
```

## Troubleshooting

### Backend Issues
- Check PostgreSQL service is running
- Verify database credentials
- Check firewall settings for port 8000
- Review Django logs in `logs/django.log`

### Frontend Issues
- Clear browser cache
- Check API endpoint configuration
- Verify CORS settings in backend
- Check browser console for errors

### SecuGen Device Issues
- Verify device is connected and recognized
- Check Device Manager for driver issues
- Ensure SDK DLL is in correct location
- Test with SecuGen sample applications

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check connection settings in settings.py
- Test connection: `psql -U postgres -d finger_db`
- Review PostgreSQL logs

## Performance Optimization

### Database Indexing
```sql
CREATE INDEX idx_users_emp_id ON users(emp_id);
CREATE INDEX idx_fingerprints_user_id ON fingerprints(user_id);
```

### Django Query Optimization
Use `select_related()` and `prefetch_related()` in views to reduce database queries.

### Frontend Optimization
- Enable gzip compression
- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize images and assets

## Security Checklist

- [ ] Change Django SECRET_KEY
- [ ] Set DEBUG = False in production
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Use HTTPS/TLS certificates
- [ ] Secure database credentials
- [ ] Implement authentication/authorization
- [ ] Enable CSRF protection
- [ ] Configure proper CORS policies
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Enable audit logging
- [ ] Encrypt sensitive data
- [ ] Regular backups
- [ ] Firewall configuration
- [ ] Secure SecuGen SDK files
