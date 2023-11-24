import { Router } from 'express';
import { searchMovies, trendingMovies, getMovie, nowRunningMovies, popularMovies, upcomingMovies } from '../controllers/moviesController.js';

const router = Router()

router.get('/trending', trendingMovies);
router.get("/nowrunning", nowRunningMovies);
router.get("/popular", popularMovies);
router.get("/upcoming", upcomingMovies);
router.get('/search/:query' , searchMovies);
router.get('/:id', getMovie);

export default router;