<div align="center">
  <img src="frontend/src/assets/Logo1024.png" alt="logo" width="300" height="auto" />
   
<h2>
    <p>Check out the website at</p>
    <a href="https://skillswap-frontend-gn9c.onrender.com">https://skillswap-frontend-gn9c.onrender.com</a>
    <p>Unfortunately the server spins down due to inactivity. It could take up to a minute for some requests.</p>
    <a href="https://youtube.com">Or watch the demo on YouTube</a>
  </h2>
</div>
<br />

<!-- Table of Contents -->
# Table of Contents
- [About the Project](#about-the-project)
  * [Screenshots](#screenshots)
  * [Tech Stack](#tech-stack)
  * [Features](#features)
- [Usage](#usage)
- [Project Setup](#project-setup-guide)
- [Contributors](#contributors)
 
<!-- About the Project -->
## About the Project
<h4>
SkillSwap is a platform that enables users to share skills and teach each other about every topic imaginable. The focus is on collaboration and human interaction, so there is no paying involved. If you want to learn and collaborate with someone, you must agree on a skill that each could teach to the other.
</h4>

<!-- Screenshots -->
### Screenshots
<div align="center">
  <img src="https://res.cloudinary.com/duqjyquqy/image/upload/v1755689339/Screenshot_from_2025-08-20_14-28-43_vrxaoc.png" width="930" height="591" alt="screenshot" />
</div>  

<br>

<div align="center">
  <img src="https://res.cloudinary.com/duqjyquqy/image/upload/v1756408492/Screenshot_from_2025-08-28_22-05-17_ah7icp.png" width="930" height="561" alt="screenshot" />
</div>

<!-- TechStack -->
### Tech Stack
- **Backend**: [Django REST Framework](https://www.django-rest-framework.org/)
- **Frontend**: [React.js](https://reactjs.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3
- **Email**: SMTP Email Service

<!-- Features -->
## Features
### Authentication & Authorization
- Sign up, login, and logout
- JWT-based authentication
- Protected API routes
- Email verification

### User Profiles
- Update profile information (phone, city, county, birth date)
- Upload profile picture
- View other users' profiles

### Skills
- Create, edit, and delete skills
- Upload images for skills
- Track skill difficulty and estimated learning time
- Send, accept and reject collaboration requests

### Messaging
- Real-time conversations between users
- Send text and file attachments
- Received/Seen icons for enhanced UX

### File Storage
- Upload and store files on AWS S3
- Secure access to files via AWS credentials
- Efficient media handling for user profiles and skills

### Search & Discovery
- Search different skills
- Filter skills by difficulty or rating

## Usage

### Creating Your First Skill
1. **Register** an account and verify your email
2. **Login** to your account
3. **Navigate** to "My Profile" 
4. **Edit** your personal information
4. **Add** new skill details (title, description, difficulty, time estimate)
5. **Upload** images if desired
6. **Publish** your skill

### Finding Skills to Learn
1. Use the **search bar** to find skills by keywords
2. Apply **filters** by difficulty level or minimum rating
3. **Browse** through the results
4. **Click** on a skill to view details

### Starting a Collaboration
1. **Find** a skill you want to learn
2. **Send** a skill swap request offering one or more of your skills in exchange
3. **Wait** for the other user to accept your request
4. **Start messaging** once the request is accepted

## Project Setup Guide
### Backend Setup
```bash
cd backend
```

#### Create and activate virtual environment:
**Linux/macOS**:
```bash
python -m venv venv
source venv/bin/activate
```
**Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

#### Install dependencies:
```bash
pip install -r requirements.txt
```

#### Add environment variables:
Create a `.env` file in the `/backend` directory:
```env
DB_PASSWORD=your_database_password
DATABASE_URL=your_database_url
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
EMAIL_HOST_USER=your_email_host_user
EMAIL_PASSWORD=your_email_password
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_STORAGE_BUCKET_NAME=your_s3_bucket_name
```

#### Run migrations and start server:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
Backend runs at: [http://localhost:8000](http://localhost:8000)

---

### Frontend Setup (React)
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Add environment variables:
Create a `.env` file in the `/frontend` directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

#### Start React development server:
```bash
npm start
```
Frontend runs at: [http://localhost:3000](http://localhost:3000)

<!-- Contributing -->
## Contributors
<a href="https://github.com/cotigadavid">David Cotiga</a>  
<a href="https://github.com/gabriel-stefan">Gabriel Stefan</a>

Project Link: [https://github.com/cotigadavid/SkillSwap/](https://github.com/cotigadavid/SkillSwap/)