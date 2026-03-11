const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const GameSchema = new mongoose.Schema({
  Id: Number,
  GameCode: String,
  Password: String,
  ChineseName: String,
  EnglishName: String,
  UpdateDate: String,
  ReleaseDate: String,
  Size: String,
  CoverImageUrl: String,
  HeaderImageUrl: String,
  DownloadUrl1: String,
  DownloadUrl2: String,
  TagsDisplay: String,
  Tags: [String],
  LastUpdated: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Game = mongoose.model('Game', GameSchema);
const User = mongoose.model('User', UserSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: config.secretOrKey,
  resave: false,
  saveUninitialized: false
}));

const fs = require('fs');
const path = require('path');

const readGamesJson = () => {
  const gamesJsonPath = path.join(__dirname, '../games.json');
  try {
    const data = fs.readFileSync(gamesJsonPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading games.json:', error.message);
    return [];
  }
};

const processGameData = (gameData) => {
  return gameData.map((game, index) => {
    let tags = [];
    if (game.TagsDisplay) {
      tags = game.TagsDisplay.split(',').map(tag => tag.trim());
    }
    return { ...game, Id: index + 1, Tags: tags, LastUpdated: new Date() };
  });
};

const updateGamesFromJson = async () => {
  try {
    const gamesData = readGamesJson();
    const processedGames = processGameData(gamesData);
    for (const gameData of processedGames) {
      const existingGame = await Game.findOne({ GameCode: gameData.GameCode });
      if (existingGame) {
        Object.assign(existingGame, gameData);
        existingGame.LastUpdated = new Date();
        await existingGame.save();
      } else {
        const newGame = new Game(gameData);
        await newGame.save();
      }
    }
    console.log('Games updated successfully in MongoDB');
  } catch (error) {
    console.error('Error updating games:', error.message);
  }
};

const initAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const adminUser = new User({ username: 'admin', password: '225822' });
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      existingAdmin.password = '225822';
      await existingAdmin.save();
      console.log('Admin user password updated');
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/games/search', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const games = await Game.find({
      $or: [
        { ChineseName: { $regex: keyword, $options: 'i' } },
        { EnglishName: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/games/search/bytag', async (req, res) => {
  try {
    const tag = req.query.tag;
    const games = await Game.find({ Tags: tag });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/games/tags/all', async (req, res) => {
  try {
    const games = await Game.find();
    const tags = new Set();
    games.forEach(game => {
      if (game.Tags) game.Tags.forEach(tag => tags.add(tag));
    });
    res.json(Array.from(tags));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ Id: req.params.id });
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Incorrect username or password' });
    if (user.password !== '' && user.password !== password) {
      return res.status(400).json({ message: 'Incorrect username or password' });
    }
    req.session.user = { username: user.username };
    res.json({ message: 'Login successful', user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/current', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

app.listen(config.port, async () => {
  console.log(`Server is running on port ${config.port}`);
  await initAdminUser();
  await updateGamesFromJson();
});

module.exports = app;