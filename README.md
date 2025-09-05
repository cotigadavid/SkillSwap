<div align="center">
  <img src="frontend/src/assets/Logo1024.png" alt="logo" width="300" height="auto" />
   
<h2>
    <p>Check out the website at</p>
    <a href="https://skillswap-frontend-gn9c.onrender.com">https://skillswap-frontend-gn9c.onrender.com</a>
    <p>Unfortunately the server spins down due to inactivity. It could take up to a minute for some requests.</p>
    <a href="https://www.youtube.com/watch?v=n83cvWLQxes&feature=youtu.be">Or watch the demo on YouTube</a>
  </h2>
</div>
<br />

<!-- Table of Contents -->
# Table of Contents
- [About the Project](#about-the-project)
  - [Screenshots](#screenshots)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
- [User Stories](#user-stories)
- [Backlog](#backlog)
- [Diagrams](#diagrams)
- [Project Setup Guide](#project-setup-guide)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup (React)](#frontend-setup-react)
- [Git Source Control](#git-source-control)
- [Continuous Integration / Automated Testing](#continuous-integration--automated-testing)
- [Bug Reporting](#bug-reporting)
- [Code Standards](#code-standards)
- [Design Patterns](#design-patterns)
- [AI Models Usage Documentation](#ai-models-usage-documentation)
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

## User Stories
- As a user, I want to register an account and verify my email so that I can access the platform.
- As a user, I want to log in to my account so that I can manage my skills.
- As a user, I want to navigate to "My Profile" so that I can view and edit my personal information.
- As a user, I want to add new skill details, including photo, title, description, difficulty, and time estimate, so that others can see what I can teach.
- As a user, I want my added skills to be visible to other users on the platform.
- As a user, I want to use the search bar and filter tab to find skills by keywords so that I can quickly find skills I’m interested in.
- As a user, I want to find a skill I want to learn so that I can exchange knowledge with another user.
- As a user, I want to click on a skill to view its details so that I can learn more about it before starting.
- As a user, I want to send a skill swap request offering one or more of my skills in exchange so that I can initiate a learning collaboration.
- As a user, I want to wait for the other user to accept my request so that I know when the collaboration can start.
- As a user, I want to start messaging once the request is accepted so that we can coordinate learning and skill exchange.

## Backlog

### 1. Defining the project theme and technologies
- [X] Defining and researching technologies.
- [X] Researching possible project themes.

### 2. Defining main functionalities
- [X] User Management: Allows users to register, log in, and manage their profile.
- [X] Skill Management: Allows users to create, edit, and publish skills.
- [X] Skill Search & Filtering: Allows users to search and filter skills by criteria.
- [X] Skill Swap Request: Allows users to exchange skills.
- [X] Collaboration: Allows users to collaborate with each other through chat.
- [X] Task distribution according to functionalities

### 3. Defining models and initializing the database
- [X] Defining the database structure.
- [X] Creating Django models corresponding to the app entities (User, Skill, Conversation, Message, etc.).
- [X] Updating the PostgreSQL database.

### 4. Creating the Backend and APIs
- [X] Implementing authentication (register, email verification, login, password reset) with JWT.
- [X] Creating REST endpoints for each functionality.
- [X] Testing APIs with Postman.

### 5. Implementing the frontend
- [X] Creating components for each module.
- [X] Connecting the frontend to the backend APIs.
- [X] Adding validations, UI, and UX.

### 6. Setting up CI/CD
- [X] Implementing automated tests on each commit and PR (Continuous Integration).
- [X] Automating deployment after CI tests pass (Continuous Deployment).
- [X] Preparing for production.

### 7. Deployment
- [X] Deciding infrastructure and deployment (Render).
- [X] Integrating external services (AWS S3, SMTP Email Service)
- [X] Documentation.

### 8. Monitoring and maintenance
- [X] Monitoring performance and optimizations.
- [X] Fixing bugs and adding new functionalities.


## Diagrams  

### Class Diagram
<div align="left">
  <img src="https://res.cloudinary.com/dp1nyner3/image/upload/v1757071923/diagrama_clase_ewl3sx.png" width="400" alt="class_diagram" />
</div>

### Use Case Diagram
<div align="left">
  <img src="https://res.cloudinary.com/dp1nyner3/image/upload/v1757071923/diagrama_use_case_u5wpfn.png" width="400" alt="class_diagram" />
</div>

### Workflow Diagram
<div align="left">
  <img src="https://res.cloudinary.com/dvcvu7whi/image/upload/v1757082650/diagrama_workflow_sixmgr.png" width="400" alt="class_diagram" />
</div>

### Sequence Diagram 
<div align="left">
  <img src="https://res.cloudinary.com/dp1nyner3/image/upload/v1757071922/diagrama_sequence_skillswaprequest_m6kix7.png" width="600" alt="class_diagram" />
</div>

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


## Git Source Control

All my contributions to this project can be viewed on GitHub.  
I have made over 25 commits, including branch creation, merges, and pull requests.

[My GitHub Contributions](https://github.com/cotigadavid/SkillSwap/graphs/contributors)


## Continuous Integration / Automated Testing

This project uses GitHub Actions to run automated tests for the backend (Django REST API) on every push and pull request.

**Status**: You can view the results of automated tests in the [GitHub Actions tab](https://github.com/cotigadavid/SkillSwap/actions).


## Bug reporting 

- [Chat Window - Bug #15](https://github.com/cotigadavid/SkillSwap/issues/15)
- [Edit User Profile - Bug #13](https://github.com/cotigadavid/SkillSwap/issues/13)


## Code standards

- Followed [Django code standards](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/)  
- Followed [React code standards](https://react.dev/reference/rules)


## Design Patterns

### Backend (Django REST)
- **Models** – define data structure.
- **Views / Serializers** – handle API logic and convert models to JSON.
- **Data Access Pattern** – Django ORM handles database interactions.

### Frontend (React)
- **Component Pattern** – Independent and reusable UI components.
- **Container / Presentational Pattern** – Separates application logic from UI.
- **Observer Pattern** – State and props update the UI when data changes.
- **Factory Pattern** – Dynamically generates components or layouts based on props.


## AI Models Usage Documentation

During the development of the project, we used various artificial intelligence tools. From the initial phase, we used OpenAI's GPT-4o model to research the technologies we intended to implement and to identify potential project topics. This proved to be very useful in the documentation process, providing us with multiple technological alternatives, clear explanations, and suggestions on how to start development. It also facilitated the drafting of a general project plan and the structuring of the backlog, managing the context of the discussions remarkably well and maintaining the consistency of information throughout several stages of the project research.

Admittedly, the discussion and context were relatively simple at first, and the model performed very well at this stage. However, as we moved into the actual development phase, difficulties began to arise in managing more complex contexts and following more detailed prompts. The model seemed to offer the simplest solution each time, without fully integrating all the requirements or nuances of more sophisticated problems, especially if the context was broad. This highlighted the model's limitations in situations requiring deeper reasoning, planning, and strict adherence to more complex specifications in the given context.

After the official launch of the GPT-5 model for users, we were initially excited, especially after watching the live presentation, which highlighted the model's advantages in web development and its ability to generate an impressive frontend with a single prompt. This was an area we were working on at the time of launch, which raised our expectations.

Unfortunately, we were disappointed. The model seems to be somehow weaker at handling complex prompts compared to previous versions, GPT-4o or GPT-4.1. It had difficulties following detailed requirements and frequently returned unusable output. In addition, when we sent it code and asked it to fix an error, the model rewrote the code in a different way without solving the original problem. In many cases, the problem was addressed with a simpler idea but with a different implementation than the original one, which GPT-5 was unable to see and, in many situations, further complicated.

OpenAI models remain a very useful tool for documentation and research, facilitating the understanding of the concepts and syntax of the technologies used, providing a general framework for their implementation and clear explanations of the code, especially in situations that do not require extensive context.

As an alternative, we used Anthropic's Claude model, specifically the Sonnet 4 version. I can say that it performed better in handling complex prompts because, with a well-detailed prompt, it was able to generate, for example, entire components in React of several hundred lines of code or the complete implementation of an API endpoint. There were situations where errors required understanding a very broad context, such as the link between API enpoints, self-signed digital generated certificates and the browser used in development, which ChatGPT could not solve even after several hours of giving it different prompts. Claude, on the other hand, was able to address them, although it also needed several prompts to cover the full context. Claude seems to handle the history of previous prompts better, while GPT seems to forget them. 

We also had the opportunity to use the Opus 4.1 model (admittedly very few times), which proved to be probably the most powerful AI model used in the development of the project. It follows the instructions in the prompt very precisely, and we used it for both planning and executing larger tasks, demonstrating great attention to logic and context consistency.

Therefore, the Claude models were our favorites for the actual development of the project. Unfortunately, the cost of using these models is very high, so we had a limited number of prompts available, but enough to make rapid progress in the development of the project. If cost were not an issue, our choice would always have been the Opus 4.1 model, which we would use for both project implementation and research and documentation.

As a final model, we also used GitHub Copilot, hoping to be more efficient in writing code through its autocomplete features. We did not notice a significant difference in productivity, as the autocomplete feature is quite aggressive, often inserting more code than necessary, which is often incorrect. The chat feature is also somewhat useful, but we preferred to use ChatGPT or Claude for such interactions. A very useful aspect of Copilot is the ability to quickly switch between multiple models while maintaining the same context.


<!-- Contributing -->
## Contributors
<a href="https://github.com/cotigadavid">David Cotiga</a>  
<a href="https://github.com/gabriel-stefan">Gabriel Stefan</a>

Project Link: [https://github.com/cotigadavid/SkillSwap/](https://github.com/cotigadavid/SkillSwap/)
