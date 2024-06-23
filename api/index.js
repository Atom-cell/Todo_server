require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoute = require('../routes/todo-route');
const userRoute = require('../routes/user-route');
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

// mongoose connection
var mongoDBURL = `mongodb+srv://sani:${process.env.DB_PASSWORD}@cluster0.jcplaj0.mongodb.net/todos?retryWrites=true&w=majority`;
mongoose
	.connect(mongoDBURL)
	.then(() => {
		console.log('Connected to DB');
	})
	.catch((error) => {
		console.error('MongoDB connection error:', error);
	});

app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.use('/todo', todoRoute);

app.use('/user', userRoute);

app.use('/', function (req, res) {
	res.json({ message: 'Base route' });
});

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
