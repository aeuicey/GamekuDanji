require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/gameDB',
  secretOrKey: process.env.SECRET_OR_KEY || 'yoursecretkey',
  port: process.env.PORT || 5000
};