const express = require('express');
const router = express.Router();
const Todo = require('../model/TodoModel');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res, next) => {
	try {
		const { text, description, type } = req.body;
		if (!text) {
			return res.status(400).json({ error: 'Text is required for a todo.' });
		}
		const newTodo = new Todo({ text:text, type:type, description:description, user_id: req.userId });
		await newTodo.save();
		res.status(201).json({ message: 'Todo added successfully.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.get('/:completed/', verifyToken, async (req, res) => {
	const userId = req.userId;
	const completed = req.params.completed;
	const type = req.query.type;
	try {
		const filter = { user_id: userId, completed: completed}
		if(type) filter['type'] = type;

		const allTodos = await Todo.find(filter).sort({ _id: -1 });
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.delete('/:id', verifyToken, async (req, res) => {
	try {
		const allTodos = await Todo.deleteOne({ _id: req.params.id });
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.put('/:id', verifyToken, async (req, res) => {
	try {
		const { text } = req.body;
		const allTodos = await Todo.findOneAndUpdate(
			{ _id: req.params.id },
			{ text: text }
		);
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.put('/:id/:status', verifyToken, async (req, res) => {
	try {
		const { id, status } = req.params;
		const allTodos = await Todo.findOneAndUpdate(
			{ _id: id },
			{ completed: status }
		);
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
