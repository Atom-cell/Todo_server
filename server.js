const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoute = require('./routes/todo-route');
var bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 5000

// mongoose connection
var mongoDBURL =
	`mongodb+srv://sani:${process.env.DB_PASSWORD}@cluster0.jcplaj0.mongodb.net/?retryWrites=true&w=majority`;
try {
	mongoose.connect(mongoDBURL);
} catch (e) {
	console.error("Couldn't connect to MongoDB");
}

app.use(cors());
// parse application/json
app.use(bodyParser.json());
 
app.use('/todo', todoRoute);


server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
