const jwt = require('jsonwebtoken');
const RevokedToken = require('../model/RevokedTokenModel');
require('dotenv').config();

async function verifyToken(req, res, next) {
	const token = req.header('Authorization');
	if (!token) return res.status(401).json({ error: 'Access denied' });
	try {
		const tokenRevoked = await RevokedToken.findOne({ access_token: token });
		if (tokenRevoked) {
			return res.status(406).json({ error: 'Duplicate Access not allowed' });
		}
		const decoded = jwt.verify(token, process.env.KEY);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		res.status(401).json({ error: 'Invalid token' });
	}
}

module.exports = verifyToken;
