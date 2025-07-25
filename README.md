# Social Platform Application

A full-stack social networking platform built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) with real-time communication features.

## Features

- 🔐 User Authentication & Authorization
- 📝 Post Creation and Interaction
- 💬 Real-time Chat System
- 👥 Friend Management System
- 🖼️ Media Upload Support
- 📱 Responsive Design
- ⚡ Real-time Updates using Socket.IO

## Tech Stack

### Frontend
- **Framework**: Angular 20+
- **UI Components**: Angular Material
- **Styling**: CSS with Bootstrap
- **State Management**: Built-in Angular Services
- **Real-time Communication**: Socket.IO Client
- **HTTP Client**: Angular HttpClient

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Server**: Socket.IO
- **File Upload**: Multer
- **API Validation**: Express Validator

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v18+ recommended)
- MongoDB
- Angular CLI
- TypeScript

## Project Structure

```
social-App/
├── Front/                      # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── Componants/    # Angular Components
│   │   │   ├── Services/      # Angular Services
│   │   │   ├── Interceptors/  # HTTP Interceptors
│   │   │   └── pipes/         # Custom Pipes
│   │   └── environments/      # Environment Configuration
│   └── package.json
│
└── Social-Back/               # Node.js Backend
    ├── src/
    │   ├── config/           # Configuration Files
    │   ├── controllers/      # Route Controllers
    │   ├── middlewares/      # Custom Middlewares
    │   ├── models/          # Mongoose Models
    │   ├── routes/          # API Routes
    │   ├── services/        # Business Logic
    │   ├── utils/           # Utility Functions
    │   └── validators/      # Request Validators
    └── package.json
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Social-Back
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   API_VERSION=v1
   PORT=3000
   CLIENT_URL=http://localhost:4200
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`

## Key Features Breakdown

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes with auth middleware

### Post Management
- Create, read, update, and delete posts
- Support for text and media content
- Privacy settings (public, private, friends-only)
- Like and interaction system

### Chat System
- Real-time messaging using Socket.IO
- Private and group chat support
- Online status indicators
- Message history

### Friend System
- Send/Accept friend requests
- Friend list management
- Online status tracking

## API Documentation

The API is versioned and all endpoints are prefixed with `/api/v1/`

### Main Endpoints:

- **Authentication**
  - POST `/api/v1/auth/register` - Register new user
  - POST `/api/v1/auth/login` - User login

- **Posts**
  - GET `/api/v1/posts` - Get all posts
  - POST `/api/v1/posts` - Create new post
  - PUT `/api/v1/posts/:id` - Update post
  - DELETE `/api/v1/posts/:id` - Delete post

- **Chat**
  - GET `/api/v1/chats` - Get user chats
  - POST `/api/v1/chats` - Create new chat
  - GET `/api/v1/messages/:chatId` - Get chat messages

- **Friends**
  - GET `/api/v1/friends` - Get friend list
  - POST `/api/v1/friends/request` - Send friend request
  - PUT `/api/v1/friends/accept/:id` - Accept friend request

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Abdelrhman

## Acknowledgments

- Angular Material for UI components
- Socket.IO for real-time features
- MongoDB Atlas for database hosting
