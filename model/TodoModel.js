const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    text: { type: "string" },
});

module.exports = mongoose.model("Todo", todoSchema);