import User from "../models/userModel.js";

export const createStack = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;
  
  try {
    if (!userId || !name) {
      throw new Error("All fields required");
    }

    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    const existingStack = user.stacks.find((stack) => stack.name === name);
    if (existingStack) {
      throw new Error("This stack already exists");
    }
    user.stacks.push({ name: name });
    await user.save();

    res.status(201).json(user.stacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const addMovie = async (req, res) => {
  const { stackId, movieId } = req.body;
  const userId = req.user._id;

  try {
    if (!userId || !stackId || !movieId) {
      throw new Error("All fields required");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const stack = user.stacks.find((stack) => stack._id.toString() === stackId);

    if (!stack) {
      throw new Error("Stack not found");
    }

    if (stack.movies.includes(movieId)) {
      throw new Error("Movie already in this stack");
    }

    stack.movies.push(movieId);
    await user.save();

    res.status(201).json({ message: "Movie added to stack" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getStacks = async (req, res) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      throw new Error("All fields required");
    }

    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    const stacks = user.stacks;

    res.status(200).json(stacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getStack = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    if (!userId) {
      throw new Error("All fields required")
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const stack = user.stacks.find((stack) => stack._id.toString() === id);

    if (!stack) {
      throw new Error("Stack not found");
    }

    const movieIds = stack.movies;
    const API_KEY = process.env.TMDB_API_KEY;

    const moviePromises = movieIds.map(async (movieId) => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error("TMDB fetch error");
      }

      const movie = {
        id: json.id,
        title: json.title,
        poster_path: json.poster_path,
        user_score: Math.floor(json.vote_average * 10),
      }
      return movie;
    });

    const movies = await Promise.all(moviePromises);
    res.status(200).json(movies)
  } catch (error) {
    res.status(400).json(error);
  }
}

export const deleteMovie = async (req, res) => {
  const { stackId, movieId } = req.body;
  const userId = req.user._id;

  try {
    if (!userId || !stackId || !movieId) {
      throw new Error("All fields required");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const stack = user.stacks.find((stack) => stack._id.toString() === stackId);

    if (!stack) {
      throw new Error("Stack not found");
    }
    const index = stack.movies.indexOf(movieId);
    if (index === -1) {
      throw new Error("Movie not in this stack");
    }

    stack.movies.splice(index, 1);
    await user.save();

    res.status(201).json(stack.movies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteStack = async (req, res) => {
  const userId = req.user._id;
  const { stackId } = req.body;

  try {
    if (!userId) {
      throw new Error("All fields required")
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const index = user.stacks.findIndex((stack) => stack._id.toString() === stackId);

    if (index === -1) {
      throw new Error("Stack not found");
    }

    user.stacks.splice(index, 1);
    await user.save();

    res.status(200).json(user.stacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const updateStack = async (req, res) => {
  const userId = req.user._id;
  const { stackId, name } = req.body;

  try {
    if (!userId || !stackId || !name) {
      throw new Error("All fields are required");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const stack = user.stacks.find((stack) => stack._id.toString() === stackId);

    if (!stack) {
      throw new Error("Stack not found");
    }

    stack.name = name;
    await user.save();

    res.status(200).json("Stack name changed successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}