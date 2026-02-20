# CineSphere – Full-Stack Movie Discovery Platform
Link: https://cine-grid-madhusudhangs-projects.vercel.app/

**A comprehensive movie discovery and social platform built with modern web technologies.**

---

## Overview

CineSphere is a full-stack web application that allows users to discover, explore, and manage their movie experiences. Built with React on the frontend and Node.js/Express on the backend, it integrates with The Movie Database (TMDb) API to provide rich movie data, trailers, and recommendations.

### Key Features

- **Movie Discovery**: Browse trending, popular, upcoming, and top-rated movies
- **Advanced Search & Filters**: Search by title, genre, year, and more
- **Reviews & Ratings**: Write and read movie reviews with star ratings
- **Social Comments**: Engage with other users through movie comments
- **Watchlist Management**: Create and manage personal watchlists
- **Custom Lists**: Organize movies into custom user-created lists
- **User Profiles**: Complete profiles with bio, preferences, and viewing history
- **Notifications**: Stay updated with personalized notifications
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Secure Authentication**: JWT-based authentication with password reset
- **Real-time Features**: Live comments and notifications

---

## Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Nodemailer** - Email services

### External APIs
- **TMDb API** - Movie database and metadata
- **OMDb API** - Additional movie information

### DevOps & Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate protection

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **TMDb API Key** (free from [themoviedb.org](https://www.themoviedb.org/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cinesphere
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

#### Backend (.env in `/backend`)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cinesphere
JWT_SECRET=your_super_secret_jwt_key_here
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

#### Frontend (.env in `/frontend`)
```env
VITE_API_URL=http://localhost:3000/api
```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:3000`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   Open `http://localhost:5173` in your browser

---

---

## Project Structure

```
cinesphere/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route business logic
│   │   ├── middleware/      # Auth, validation, security
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── socket/          # Real-time features
│   │   ├── utils/           # Helpers and utilities
│   │   └── server.js        # Main server file
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route components
│   │   ├── store/           # Redux state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # API calls and utilities
│   │   ├── styles/          # Global styles
│   │   └── App.jsx          # Main app component
│   ├── public/              # Static assets
│   ├── package.json
│   └── README.md
├── package.json
└── README.md
```

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Movie Endpoints
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/search/:query` - Search movies

### User Features
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist/:movieId` - Remove from watchlist
- `GET /api/reviews` - Get movie reviews
- `POST /api/reviews` - Create review
- `GET /api/comments/:movieId` - Get movie comments

### Advanced Features
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/notifications` - Get user notifications

---

## Features in Detail

### Movie Discovery
- **Trending Movies**: Daily/weekly trending content
- **Genre Filtering**: Browse by action, comedy, drama, etc.
- **Search Functionality**: Full-text search with debouncing
- **Movie Details**: Cast, crew, trailers, similar movies
- **Advanced Filters**: Year, rating, popularity sorting

### Social Features
- **User Reviews**: Star ratings and written reviews
- **Comments System**: Real-time comments on movies
- **User Profiles**: Follow/unfollow other users
- **Achievements**: Gamification elements
- **Notifications**: Activity updates and recommendations

---

## Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup` - Install dependencies

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- **ESLint**: Configured for React and Node.js
- **Prettier**: Code formatting (via ESLint)
- **Security**: Helmet, rate limiting, input validation

---

## Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to cloud platform (Heroku, Railway, etc.)
3. Configure MongoDB Atlas for production database

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables in hosting platform

### Recommended Deployment Stack
- **Frontend**: Vercel or Netlify
- **Backend**: Railway or Render
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary (for user avatars)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **TMDb** for providing comprehensive movie data
- **Framer Motion** for smooth animations
- **Tailwind CSS** for beautiful styling
- **React Community** for excellent documentation and tools

---

## Support

For questions or support, please open an issue on GitHub or contact the maintainers.

**Happy movie discovering!**


## Contributing  
Pull requests are welcome! For major changes, please open an issue first to discuss.  

---

## License  
This project is licensed under the **MIT License**.  

---

## Acknowledgements  
- [TMDb API](https://www.themoviedb.org/) for movie data  
- [Framer Motion](https://www.framer.com/motion/) for animations  
- [TailwindCSS](https://tailwindcss.com/) for UI styling  
