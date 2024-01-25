const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    text: { type: "string" },
    completed: { 
        type: "boolean",
        default: false
    },
});

module.exports = mongoose.model("Todo", todoSchema);