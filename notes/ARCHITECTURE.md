# System Architecture

## Overview
This is a biometric fingerprint authentication system built with a Django REST API backend and React frontend, integrated with SecuGen fingerprint readers.

## Technology Stack

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Database**: PostgreSQL
- **Language**: Python 3.x
- **Key Libraries**:
  - psycopg2-binary (PostgreSQL adapter)
  - django-cors-headers (CORS handling)
  - Pillow (Image processing)
  - requests (HTTP client)

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: Tailwind CSS 3.3.5
- **Language**: JavaScript (JSX)

### Hardware Integration
- **SDK**: SecuGen FDx SDK Pro for Windows v4.3.1
- **Platform**: Windows (i386/x64)
- **Interface**: .NET DLL integration

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Application (Vite)                            │  │
│  │  - User Management UI                                │  │
│  │  - Fingerprint Registration UI                       │  │
│  │  - Fingerprint Verification UI                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           │ HTTP/REST API                    │
│                           │ (Axios)                          │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                           ▼                                  │
│                    Backend Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Django REST Framework                               │  │
│  │  ┌────────────────┐  ┌──────────────────────────┐   │  │
│  │  │  Users App     │  │  Fingerprints App        │   │  │
│  │  │  - Models      │  │  - Models                │   │  │
│  │  │  - Views       │  │  - Views                 │   │  │
│  │  │  - Serializers │  │  - Serializers           │   │  │
│  │  │  - URLs        │  │  - Services (Matching)   │   │  │
│  │  └────────────────┘  └──────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           │ ORM (Django)                     │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                           ▼                                  │
│                    Database Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database (finger_db)                     │  │
│  │  - users table                                       │  │
│  │  - fingerprints table                                │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Hardware Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SecuGen Fingerprint Reader                          │  │
│  │  - FDx SDK Pro .NET DLL                              │  │
│  │  - USB Device Communication                          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    emp_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Fingerprints Table
```sql
CREATE TABLE fingerprints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    template_data BYTEA NOT NULL,
    quality_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### User Management
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user by ID
- `GET /api/users/search/?emp_id={emp_id}` - Search user by employee ID
- `POST /api/users/` - Create new user
- `DELETE /api/users/{id}/` - Delete user

### Fingerprint Management
- `POST /api/fingerprints/capture/` - Capture and store fingerprint
- `POST /api/fingerprints/verify/` - Verify fingerprint against stored templates
- `GET /api/fingerprints/user/{user_id}/` - Get all fingerprints for a user
- `DELETE /api/fingerprints/{id}/` - Delete fingerprint

## Component Architecture

### Frontend Components
```
src/
├── components/
│   ├── Alert.jsx              # Alert notifications
│   ├── Button.jsx             # Reusable button component
│   ├── FingerprintCapture.jsx # Fingerprint capture interface
│   ├── Input.jsx              # Form input component
│   ├── Layout.jsx             # Page layout wrapper
│   └── LoadingSpinner.jsx     # Loading indicator
├── pages/
│   ├── Home.jsx               # Landing page
│   ├── RegisterUser.jsx       # User registration
│   ├── UserManagement.jsx     # User CRUD operations
│   └── VerifyFingerprint.jsx  # Fingerprint verification
└── services/
    ├── api.js                 # Backend API client
    └── secugen.js             # SecuGen SDK integration
```

### Backend Apps

#### Users App
- Manages user accounts and employee information
- Provides CRUD operations for user data
- Handles user search functionality

#### Fingerprints App
- Manages fingerprint templates
- Handles fingerprint capture and storage
- Implements fingerprint matching/verification logic
- Stores biometric data securely as binary data

## Data Flow

### User Registration Flow
1. User enters employee ID and name in frontend
2. Frontend sends POST request to `/api/users/`
3. Backend validates and stores user in PostgreSQL
4. Returns user object with generated ID

### Fingerprint Enrollment Flow
1. User selects employee from list
2. Frontend initiates SecuGen SDK capture
3. Fingerprint template is captured via USB device
4. Template data sent to `/api/fingerprints/capture/`
5. Backend stores binary template with user reference
6. Quality score is recorded

### Fingerprint Verification Flow
1. User initiates verification in frontend
2. Frontend captures fingerprint via SecuGen SDK
3. Template sent to `/api/fingerprints/verify/`
4. Backend retrieves all stored templates
5. Matching algorithm compares templates
6. Returns match result with confidence score

## Security Considerations

### Current Implementation
- CORS enabled for local development
- PostgreSQL for secure data storage
- Binary storage of fingerprint templates
- Cascade deletion of fingerprints when user is deleted

### Production Recommendations
- Change SECRET_KEY in Django settings
- Set DEBUG = False
- Restrict ALLOWED_HOSTS
- Implement HTTPS/TLS
- Add authentication/authorization (JWT tokens)
- Encrypt fingerprint templates at rest
- Implement rate limiting
- Add audit logging
- Secure database credentials (environment variables)
- Implement proper CORS policies

## Scalability Considerations

### Current Limitations
- Single database instance
- Synchronous request handling
- In-memory template matching

### Future Improvements
- Database replication and read replicas
- Caching layer (Redis) for frequent queries
- Async task queue (Celery) for matching operations
- Load balancing for multiple backend instances
- CDN for frontend static assets
- Microservices architecture for high-volume scenarios
