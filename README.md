# Fingerprint Authentication System

A full-stack biometric authentication system using SecuGen fingerprint readers, built with Django REST Framework and React.

## Features

- User registration and management
- Fingerprint enrollment and storage
- Fingerprint verification and matching
- Real-time fingerprint capture via SecuGen devices
- RESTful API architecture
- Modern React UI with Tailwind CSS

## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL
- Python 3.x

### Frontend
- React 18.2.0
- Vite 5.0.8
- React Router DOM 6.20.0
- Axios 1.6.2
- Tailwind CSS 3.3.5

### Hardware
- SecuGen FDx SDK Pro for Windows v4.3.1
- SecuGen USB Fingerprint Reader

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- SecuGen fingerprint reader
- Windows OS

### 1. Database Setup
```cmd
psql -U postgres
CREATE DATABASE finger_db;
```

### 2. Backend Setup
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```cmd
cd frontend
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## Project Structure

```
.
├── backend/
│   ├── fingerprint_api/      # Django project settings
│   ├── users/                # User management app
│   ├── fingerprints/         # Fingerprint management app
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── services/         # API and SDK services
│   ├── package.json
│   └── vite.config.js
├── secugen/                  # SecuGen SDK files
└── notes/
    ├── ARCHITECTURE.md       # System architecture documentation
    └── DEPLOYMENT.md         # Deployment guide
```

## API Endpoints

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user details
- `DELETE /api/users/{id}/` - Delete user
- `GET /api/users/search/?emp_id={emp_id}` - Search by employee ID

### Fingerprints
- `POST /api/fingerprints/capture/` - Capture and store fingerprint
- `POST /api/fingerprints/verify/` - Verify fingerprint
- `GET /api/fingerprints/user/{user_id}/` - Get user fingerprints
- `DELETE /api/fingerprints/{id}/` - Delete fingerprint

## Configuration

### Backend Configuration
Edit `backend/fingerprint_api/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'finger_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Frontend Configuration
Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Usage

### Register a New User
1. Navigate to "Register User" page
2. Enter employee ID and name
3. Click "Register User"

### Enroll Fingerprint
1. Go to "User Management" page
2. Select a user from the list
3. Click "Capture Fingerprint"
4. Place finger on SecuGen reader
5. Fingerprint template is stored

### Verify Fingerprint
1. Navigate to "Verify Fingerprint" page
2. Click "Capture & Verify"
3. Place finger on reader
4. System matches against all stored templates
5. View verification result

## Development

### Run Backend Tests
```cmd
cd backend
python manage.py test
```

### Build Frontend for Production
```cmd
cd frontend
npm run build
```

### Database Migrations
```cmd
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Documentation

- [Architecture Documentation](notes/ARCHITECTURE.md) - System design and architecture
- [Deployment Guide](notes/DEPLOYMENT.md) - Production deployment instructions

## Security Notes

This is a development setup. For production:
- Change Django SECRET_KEY
- Set DEBUG = False
- Configure ALLOWED_HOSTS
- Use HTTPS/TLS
- Implement authentication
- Secure database credentials
- Enable proper CORS policies

See [DEPLOYMENT.md](notes/DEPLOYMENT.md) for complete security checklist.

## Troubleshooting

### Backend won't start
- Verify PostgreSQL is running
- Check database credentials
- Ensure virtual environment is activated

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check CORS settings in Django
- Confirm API_BASE_URL in api.js

### SecuGen device not detected
- Check USB connection
- Verify SDK installation
- Check Device Manager for driver issues

## License

This project is for educational and internal use.

## Support

For issues and questions, please refer to the documentation in the `notes/` directory.

git upload
```cmd
git add . && git commit -m "Updated" && git push ;
```