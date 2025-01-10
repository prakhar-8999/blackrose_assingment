# Backend and Frontend Project

## Overview

This project consists of two main components: a **backend** built with Python (FastAPI) and a **frontend** built with React or Vue. The backend provides real-time random number generation and CRUD operations on a CSV file, while the frontend provides an interactive UI with real-time data streaming and CRUD functionality.

## Core Features

### Backend (FastAPI)

- **Authentication**:
  - Accepts any username and password for login.
  - Issues session tokens (JWT or UUID-based).
  - Validates session tokens for protected endpoints.

- **Random Number Generator**:
  - Generates random numbers every second.
  - Stores the numbers in a database (SQLite or Redis).
  - Key: Current timestamp, Value: Random number.

- **API Endpoints**:
  - **Login Endpoint**: Issues tokens for authentication.
  - **Real-Time Data Streaming**: Provides a WebSocket or REST endpoint to stream random numbers (requires authentication).
  - **CSV File Fetch**: Fetches the provided `backend_table.csv` (requires authentication).
  - **CRUD Operations**: 
    - Allows Create, Read, Update, and Delete operations on `backend_table.csv`.
    - Persists changes to the file and returns errors for invalid operations.
  - **Concurrency Management**: 
    - Implements a file locking mechanism to handle simultaneous CRUD operations.
  - **Recovery Mechanism**: 
    - Creates a backup of the `backend_table.csv` before overwriting for recovery.

- **Database**:
  - Stores user sessions (username and token).
  - Stores generated random numbers (timestamp and value).

- **Hosting**:
  - The backend is deployed on a free platform like Render, Railway, or Deta.

### Frontend (React/Vue)

- **Authentication**:
  - Create a login page for username and password input.
  - Store the session token using a state management library (e.g., Redux/Zustand for React, Vuex/Pinia for Vue).
  - Restrict access to application pages for unauthenticated users.

- **Main Application**:
  - Use a dark theme UI.
  - Includes the following components:
    - **Interactive Plot**: Displays real-time streamed random numbers using libraries like Chart.js or D3.js.
    - **Dynamic Table**: Shows stored numbers and records in a paginated, sortable table.
    - **CRUD Interface**: Allows users to perform CRUD operations on `backend_table.csv`.

- **Features**:
  - **Dynamic Updates**: Real-time data streaming updates the plot and table dynamically.
  - **Error Handling**: Displays errors for failed logins, unauthorized actions, or conflicting CRUD operations.
  - **Session Persistence**: Uses `localStorage` or `sessionStorage` to maintain the user session.
  - **Concurrency Handling**: Informs users of conflicting or pending operations during simultaneous CRUD actions.
  - **Recovery UI**: Provides an option to restore data from the most recent backup file.

## Installation

### Backend Setup

1. Clone the backend repository:
   ```bash
   git clone https://github.com/your-repo/backend.git
   cd backend
