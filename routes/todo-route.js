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
		const newTodo = new Todo({
			text: text,
			type: type,
			description: description,
			user_id: req.userId,
		});
		await newTodo.save();
		res
			.status(201)
			.json({ message: 'Todo added successfully.', todo: newTodo });
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
		const filter = { user_id: userId, completed: completed };
		if (type) filter['type'] = type;

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
		const { text, description, type } = req.body;
		if (!text || !type) {
			const field = !text ? 'Text' : !type ? 'Type' : null;
			return res
				.status(400)
				.json({ error: `${field} is required for a todo.` });
		}
		const editTodo = await Todo.findOneAndUpdate(
			{ _id: req.params.id },
			{ text: text, type: type, description: description },
			{ new: true }
		);
		res
			.status(200)
			.json({ message: 'Todo edited successfully.', todo: editTodo });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

//for completing and uncompleting todos
router.put('/:id/:status', verifyToken, async (req, res) => {
	const userId = req.userId;
	try {
		const { id, status } = req.params;
		const allTodos = await Todo.findOneAndUpdate(
			{ _id: id, user_id: userId },
			{ completed: status }
		);
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
