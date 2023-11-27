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

export const getMovie = async(req, res) => {
  const API_KEY = process.env.TMDB_API_KEY;
  const id = req.params.id;
  const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos,credits,similar&api_key=${API_KEY}`;
  const getLanguage = (code) => new Intl.DisplayNames(['en'], { type: "language" }).of(code);

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(`Fetch failed ${res.status}`);
    } else {
      const director = json.credits.crew.filter((item) => item.job === "Director");
      const trailer = json.videos.results.length >= 1 ? json.videos.results.filter((result) => result.type === "Trailer" && result.site === "YouTube").pop().key : null;
      const similar = json.similar.results.map(({ id, poster_path }) => ({ id, poster_path }));
      const cast = json.credits.cast.map((profile) => ({
        id: profile.id,
        name: profile.name,
        character: profile.character,
        profile_path: profile.profile_path,
      }))


      const movie = {
        id: json.id,
        title: json.title,
        status: json.status,
        genres: json.genres,
        release_date: json.release_date,
        language: getLanguage(json.original_language),
        poster_path: json.poster_path,
        backdrop_path: json.backdrop_path,
        tagline: json.tagline,
        vote_average: json.vote_average,
        director: director,
        overview: json.overview,
        cast: cast.slice(0, 12),
        trailer: trailer,
        similar: similar,
      }

      res.status(200).json(movie);
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}