/**
 * Must be the same key used in the JWTStrategy
 */
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
	passport = require('passport');

/**
 * Local passport file
 */
require('./passport');

/**
 * Generates the JSON Web Token and sets its expiration to 7 days
 * @param {*} user 
 */
let generateJWTToken = (user) => {
	return jwt.sign(user, jwtSecret, {
		subject: user.Username, // Username you’re encoding in the JWT
		expiresIn: '7d', // Specifies that the token will expire in 7 days
		algorithm: 'HS256' // Algorithm used to "sign"/encode values of JWT
	});
}

/**
 * POST Login
 * @param {*} router 
 */
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
