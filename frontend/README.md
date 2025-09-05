# 🎬 CineGrid – Full-Stack Movie Discovery App  


**GitHub:** [github.com/Madhusudhangupta/CineGrid-Full-Stack-Movie-Discovery-App](https://github.com/Madhusudhangupta/CineGrid-Full-Stack-Movie-Discovery-App)  

---

## Overview  
CineGrid is a **full-stack movie discovery platform** where users can:  
- Explore trending & upcoming movies from the **TMDb API**  
- Save favorites to a **personal watchlist**  
- Authenticate securely using **JWT**  
- Switch languages with **i18n internationalization**  
- Enjoy a sleek, **dark-mode enabled**, and **animated UI** with **Framer Motion**  

---

## Features  

- **Responsive UI** with **Tailwind CSS** & dark mode toggle  
- **Watchlist system** (local + MongoDB sync)  
- Movie details, trailers & recommendations  
- Secure **JWT Authentication** (Register/Login)  
- **User profile management** with achievements & recommendations  
- **Multi-language support** via `react-i18next`  
- **Framer Motion animations** for smooth transitions  
- Floating **heart button** to add/remove movies from watchlist  

---

## Tech Stack  

**Frontend:** React.js, Redux Toolkit, Tailwind CSS, Framer Motion, Vite  
**Backend:** Node.js, Express.js, MongoDB, JWT Authentication  
**API:** [TMDb API](https://www.themoviedb.org/)  
**Other Tools:** ESLint, PostCSS, i18n  

---

## Getting Started  

### 1 Clone the Repository  
```bash
git clone https://github.com/Madhusudhangupta/CineGrid-Full-Stack-Movie-Discovery-App.git
cd CineGrid-Full-Stack-Movie-Discovery-App
```

### 2 Setup Backend  
```bash
cd backend
npm install
npm run dev
```

### 3 Setup Frontend  
```bash
cd frontend
npm install
npm run dev
```

### 4 Add Environment Variables  

#### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

#### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

## Screenshots  

| Home Page | Movie Detail | Watchlist |  
|-----------|--------------|------------|  
| ![Home](https://via.placeholder.com/300x200.png?text=Home+Page) | ![Movie Detail](https://via.placeholder.com/300x200.png?text=Movie+Detail) | ![Watchlist](https://via.placeholder.com/300x200.png?text=Watchlist) |  


---


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
