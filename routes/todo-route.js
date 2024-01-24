const express = require("express");
const router = express.Router();
const Todo = require('../model/TodoModel');

router.post('/', async (req, res, next) => {
	try {
		const { text } = req.body;

		// Validate input
		if (!text) {
			return res.status(400).json({ error: 'Text is required for a todo.' });
		}

		// Create a new todo
		const newTodo = new Todo({ text });

		// Save the todo to the database
		await newTodo.save();

		res.status(201).json({ message: 'Todo added successfully.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.get('/', async (req, res) => {
	try {
		// Fetch all todos from the database
		const allTodos = await Todo.find();

		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
