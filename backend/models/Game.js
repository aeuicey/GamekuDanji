const mongoose = require('mongoose');

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
  LastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', GameSchema);