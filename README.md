## Project Setup Guide

### Backend Setup

```bash
cd backend
```

#### Create and activate virtual environment:

- **Linux/macOS**:

```bash
python -m venv venv
source venv/bin/activate
```

- **Windows**:

```bash
python -m venv venv
venv\Scripts\activate
```

#### Install dependencies:

```bash
pip install -r requirements.txt
```

#### Add environment variables:

Create a `.env` file in the `backend/` folder with your settings (e.g., secret key, database credentials, etc.).

#### Run the server:

```bash
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

#### Start React development server:

```bash
npm start
```

Frontend runs at: [http://localhost:3000](http://localhost:3000)
