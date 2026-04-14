# Portfolio Management System

A full-stack web application securely designed to help users manage their financial portfolios. Users can elegantly track their asset holdings, edit their prices and quantities, and view their total balance in real-time.

This repository is a monorepo featuring:
- `/backend`: A robust Python Flask RESTful API.
- `/frontend`: A highly dynamic, glassmorphism-styled React client built with Vite.

## Core Features

- **Secure Access**: Registration and Login using `Flask-JWT-Extended` stateful tokenization.
- **Portfolio Operations**: Full CRUD (Create, Read, Update, Delete) capability on individual assets directly from the dashboard.
- **Dynamic Asset Tracking**: Total value instantly scales accurately based on manual quantity and value inputs.
- **Premium Aesthetics**: Fully responsive interface highlighting dynamic micro-animations, tailored gradients, and a frosted glass theme.

## Setup Instructions

To run this application locally, you must run both pieces of the stack simultaneously in separate terminal instances.

### 1. Launch the Backend API

```bash
cd backend

# Create & activate your virtual environment
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install the Python requirements
pip install -r requirements.txt

# Run the Flask Server
python run.py
```
> The API will serve at http://127.0.0.1:5000/. It automatically proxies your local database setup on initial startup.

### 2. Launch the Web Frontend

Open a new terminal window at the project root:

```bash
cd frontend

# Install the Node dependencies
npm install

# Run the Vite Dev Server
npm run dev
```
> The dashboard interface will open up at http://localhost:5173/ and will automatically route requests internally to your backend process.
