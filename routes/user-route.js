const express = require('express');
const router = express.Router();
const User = require('../model/UserModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const RevokedToken = require('../model/RevokedTokenModel');
const jwt = require('jsonwebtoken');
// const transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	auth: {
// 		user: 'work.sani06@gmail.com',
// 		pass: 'worc bmah wenp hlxq',
// 	},
// 	tls: {
// 		rejectUnauthorized: false,
// 	},
// });

const isValidPassword = async function (password, user) {
	try {
		return await bcrypt.compare(password, user.password);
	} catch (error) {
		return false;
	}
};

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};
router.post('/register', async (req, res) => {
	const { email, name, password, gender } = req.body;

	if (!email || !name || !password || !gender) {
		const field = !email
			? 'email'
			: !name
			? 'name'
			: !password
			? 'password'
			: 'gender';
		return res.status(400).json({ error: `${field} is required` });
	}

	try {
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			return res.status(400).json({ error: 'Email already taken' });
		} else {
			const hashedPassword = await hashPassword(password);
			// Create a new user object
			const user = new User({
				email: email,
				name: name,
				password: hashedPassword,
				gender: gender,
			});

			await user.save();

			return res.status(201).json({
				message: 'Success',
				data: { user_id: user._id, email: email, name: name },
			});
		}
	} catch (err) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		const field = !email ? 'email' : 'password';
		return res.status(400).json({ error: `${field} is required` });
	}

	try {
		const user = await User.findOne({ email: email });
		if (user) {
			const validUser = await isValidPassword(password, user);
			if (!validUser) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}
		} else {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		if (user.access_token) {
			await RevokedToken.create({ access_token: user.access_token });
		}
		const token = jwt.sign({ userId: user._id }, 'your-secret-key');
		user.access_token = token;
		await user.save();
		return res.status(200).json({ message: 'Success', data: { user: user } });
	} catch (err) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.put('/reset-password', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		const field = !email ? 'email' : 'password';
		return res.status(400).json({ error: `${field} is required` });
	}

	try {
		const user = await User.findOne({ email: email });
		if (user) {
			const hashedPassword = await hashPassword(password);
			await User.findOneAndUpdate(
				{ email: email },
				{ password: hashedPassword }
			);
		} else {
			return res.status(401).json({ error: 'Invalid email' });
		}
		return res.status(201).json({ message: 'Successfully Reset' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});
// router.get('/', async function (req, res) {
// 	// send email
// 	try {
// 		let mailOptions = {
// 			from: ' "Verify your email" <cinnakale@gmail.com>',
// 			to: 'saniusnain@gmail.com',
// 			subject: 'REMS - Email Verification',
// 			html: `
//         <h2>  Thank you for choosing REMS </h2>
//         <h4>Please verify your email</h4>
//         <a>Verify your Email </a>
//         `,
// 		};

// 		transporter.sendMail(mailOptions, (err, info) => {
// 			if (err) console.log(err.message);
// 			else {
// 				console.log('VERIFICATION EMAIL SENT!!!');
// 			}
// 		});
// 	} catch (err) {
// 		res.status(500).json({ message: err.message });
// 	}
// });

module.exports = router;
