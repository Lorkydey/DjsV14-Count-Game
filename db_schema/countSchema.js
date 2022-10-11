
const { Schema, model } = require("mongoose");
const countSchema = new Schema({
    guildId: String,
  currentnum: Number,
  topnum: Number,
});

module.exports = model("countSchema", countSchema);