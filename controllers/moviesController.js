export const trendingMovies = (req, res) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed. ${response.status}`)
      }
    })
    .then(data => {
      res.status(200).json(data.results);
    })
    .catch(err => res.status(400).json({ error: err.message })); 
}

export const nowRunningMovies = (req, res) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed. ${response.status}`)
      }
    })
    .then(data => {
      res.status(200).json(data.results);
    })
    .catch(err => res.status(400).json({ error: err.message })); 
}

export const popularMovies = (req, res) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed. ${response.status}`)
      }
    })
    .then(data => {
      res.status(200).json(data.results);
    })
    .catch(err => res.status(400).json({ error: err.message })); 
}

export const upcomingMovies = (req, res) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed. ${response.status}`)
      }
    })
    .then(data => {
      res.status(200).json(data.results);
    })
    .catch(err => res.status(400).json({ error: err.message })); 
}

export const searchMovies = (req, res) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&adult=false&query=`;

  const query = req.params.query;

  fetch(url + query)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed. ${response.status}`);
      }
    })
    .then(data => {
      res.status(200).json(data.results);
    })
    .catch(error => res.status(400).json({ error: error.message }));
}

export const getMovie = (req, res) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const id = req.params.id;
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed. ${response.status}`);
      }
    })
    .then(movie => res.status(200).json(movie))
    .catch(error => res.status(400).json({ error: error.message }));
}