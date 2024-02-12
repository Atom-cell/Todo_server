const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
	text: { type: 'string' },
	completed: {
		type: 'boolean',
		default: false,
	},
	description: { type: 'string'},
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	type: { type: 'string' },
});

module.exports = mongoose.model('Todo', todoSchema);
