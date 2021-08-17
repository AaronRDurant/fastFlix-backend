const jwtSecret = 'your_jwt_secret'; // Must be same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
	passport = require('passport');

require('./passport'); // Local passport file

let generateJWTToken = (user) => {
	return jwt.sign(user, jwtSecret, {
		subject: user.Username, // Username you're encoding in the JWT
		expiresIn: '7d', // Specifies that the token will expire in 7 days
		algorithm: 'HS256' // Algorithm used to "sign"/encode values of JWT
	});
}


// Allow users to log in
module.exports = (router) => {
	router.post('/login', (req, res) => {
		passport.authenticate('local', { session: false }, (error, user, info) => {
			if (error || !user) {
				return res.status(400).json({
					message: 'Something is not right',
					user: user
				});
			}
			req.login(user, { session: false }, (error) => {
				if (error) {
					res.send(error);
				}
				let token = generateJWTToken(user.toJSON());
				return res.json({ user, token });
			});
		})(req, res);
	});
}
