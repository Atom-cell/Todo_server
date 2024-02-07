const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
	text: { type: 'string' },
	completed: {
		type: 'boolean',
		default: false,
	},
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Todo', todoSchema);
