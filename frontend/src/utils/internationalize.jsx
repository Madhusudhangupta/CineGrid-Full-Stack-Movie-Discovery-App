
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: 'Cinesphere',
        trending: 'Trending Movies',
        home: 'Home',
        login: 'Login',
        register: 'Register',
        profile: 'Profile',
        offline: 'Offline',
        watchlist: 'Watchlist',
        recommendations: 'Recommendations',
        comments: 'Comments',
        noWatchlist: 'No movies in watchlist.',
        noRecommendations: 'No recommendations yet.',
        noComments: 'No comments yet.',
        writeComment: 'Write a comment...',
        submit: 'Submit',
        delete: 'Delete',
        reason: 'Reason',
        rating: 'Rating',
        comment: 'Comment',
        error: {
          fetchMovies: 'Failed to load trending movies. Please try again later.',
          invalidCredentials: 'Invalid email or password.',
          registrationFailed: 'Registration failed. Please try again.',
          loginRequired: 'Please log in to perform this action.',
          fetchComments: 'Failed to load comments.',
          commentFailed: 'Failed to post comment.',
          deleteComment: 'Failed to delete comment.',
          fetchRecommendations: 'Failed to load recommendations.',
          reviewFailed: 'Failed to post review.',
        },
      },
    },
    es: {
      translation: {
        welcome: 'Cinesphere',
        trending: 'Películas en tendencia',
        home: 'Hogar',
        login: 'Iniciar sesión',
        register: 'Registrarse',
        profile: 'Perfil',
        offline: 'Sin conexión',
        watchlist: 'Lista de seguimiento',
        recommendations: 'Recomendaciones',
        comments: 'Comentarios',
        noWatchlist: 'No hay películas en la lista de seguimiento.',
        noRecommendations: 'Aún no hay recomendaciones.',
        noComments: 'Aún no hay comentarios.',
        writeComment: 'Escribe un comentario...',
        submit: 'Enviar',
        delete: 'Eliminar',
        reason: 'Razón',
        error: {
          fetchMovies: 'No se pudieron cargar las películas en tendencia. Intenta de nuevo.',
          invalidCredentials: 'Correo o contraseña inválidos.',
          registrationFailed: 'El registro falló. Intenta de nuevo.',
          loginRequired: 'Por favor, inicia sesión para realizar esta acción.',
          fetchComments: 'No se pudieron cargar los comentarios.',
          commentFailed: 'No se pudo publicar el comentario.',
          deleteComment: 'No se pudo eliminar el comentario.',
          fetchRecommendations: 'No se pudieron cargar las recomendaciones.',
          reviewFailed: 'No se pudo publicar la reseña.',
        },
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
