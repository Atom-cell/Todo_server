const express = require("express");
const router = express.Router();
const Todo = require('../model/TodoModel');

router.post('/', async (req, res, next) => {
	try {
		const { text } = req.body;
		if (!text) {
			return res.status(400).json({ error: 'Text is required for a todo.' });
		}
		const newTodo = new Todo({ text });
		await newTodo.save();
		res.status(201).json({ message: 'Todo added successfully.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.get('/', async (req, res) => {
	try {
		const allTodos = await Todo.find().sort({ _id: -1 });
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const allTodos = await Todo.deleteOne({_id: req.params.id})
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.put('/:id', async (req, res) => {
	try {
		const {text} = req.body;
		const allTodos = await Todo.findOneAndUpdate({_id: req.params.id}, {text: text});
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.put('/:id/:status', async (req, res) => {
	try {
		const {id, status} = req.params;
		const allTodos = await Todo.findOneAndUpdate({_id: id}, {completed: status});
		res.status(200).json(allTodos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;