const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	email: { type: 'string', required: true },
	name :{
        type: 'string', required: true
    },
    password :{
        type: 'string', required: true
    },
    gender: {
        type: 'string', required: true,
    },
    access_token : {
        type: 'string'
    }
});

module.exports = mongoose.model('User', userSchema);
