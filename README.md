# Game Resource Library

A modern game resource library built with React, Node.js, and MongoDB.

## Features

- 🎮 Game search with Chinese/English fuzzy search
- 🏷️ Tag-based filtering
- 📱 Responsive design for all devices
- 🌙 Dark/Light theme switching
- 📄 Pagination display
- 🔐 Session-based authentication

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- HeroUI (NextUI)
- Framer Motion

### Backend
- Express.js
- MongoDB with Mongoose
- Express Session

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/aeuicey/GamekuDanji.git
cd GamekuDanji
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Create `.env` file in the root directory
```
MONGO_URI=mongodb://localhost:27017/gameDB
SECRET_OR_KEY=your_secret_key
PORT=5000
```

5. Start MongoDB service

6. Start the backend server
```bash
npm run dev
# or
node backend/server.js
```

7. Start the frontend development server
```bash
cd frontend
npm run dev
```

8. Open http://localhost:5173 in your browser

## Default Login

- Username: `admin`
- Password: `225822`

## License

MIT License