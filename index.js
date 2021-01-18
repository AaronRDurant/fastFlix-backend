const express = require('express'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	Models = require('./models.js'),
	bodyParser = require('body-parser');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

const { check, validationResult } = require('express-validator');

app.use(cors({
	origin: (origin, callback) => {
		if(!origin) return callback(null, true);
		if(allowedOrigins.indexOf(origin) === -1){
			let message = 'The CORS policy for this application does not allow access from origin ' + origin;
			return callback(new Error(message), false);
		}
		return callback (null, true);
	}
}));

// Get home page
app.get('/', (req, res) => {
	res.send('Welcome to fastFlix!');
});

// Get all movies
app.get('/movies', (req, res) => {
	Movies.find()
	.then((movies) => {
		res.status(201).json(movies);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.find()
	.then((users) => {
		res.status(201).json(users);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOne({ Username: req.params.Username })
	.then((user) => {
		res.json(user);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ Title: req.params.Title})
	.then((movie) => {
		res.status(201).json(movie);
	})
	.catch((err) => {
		console.err(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get a genre by title
app.get('/movies/genres/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ Title: req.params.Title})
	.then((movie) => {
		res.status(201).json(movie.Genre.Name + ": " + movie.Genre.Description);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get a director by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.findOne({ "Director.Name": req.params.Name})
	.then((movie) => {
		res.status(201).json(movie.Director.Name + ": " + movie.Director.Bio);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// Add a user
app.post('/users',
	[
		check('Username', 'Username is required').isLength({min: 5}),
		check('Username', 'Username contains non-alphanumeric characters — not allowed.').isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid.').isEmail()
	], (req, res) => {
		
	// Checks validation object for errors
	let errors = validationResult(req);
	
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	
	let hashedPassword = Users.hashPassword(req.body.Password);
	// Checks if requested username already exists
	Users.findOne({ Username: req.body.Username })
	.then((user) => {
		// If the username already exists, send a response saying so
		if (user) {
			return res.status(400).send(req.body.Username + ' already exists');
		} else {
			Users
			.create({
				Username: req.body.Username,
				Password: hashedPassword,
				Email: req.body.Email,
				Birthday: req.body.Birthday
			})
			.then((user) => { res.status(201).json(user) })
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error: ' + error);
			});
		}
	})
	.catch((error) => {
		console.error(error);
		res.status(500).send('Error: ' + error);
	});
});

// Update user info by username
app.put('/users/:Username',
	[
		check('Username', 'Username is required').isLength({min: 5}),
		check('Username', 'Username contains non-alphanumeric characters — not allowed.').isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid.').isEmail()
	], (req, res) => {
			
	// Checks validation object for errors
	let errors = validationResult(req);
	
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	
	let hashedPassword = Users.hashPassword(req.body.Password);
	
	Users.findOneAndUpdate({ Username: res.params.Username },
		{ $set: {
			Username: req.body.Username,
			Password: hashedPassword,
			Email: req.body.Email,
			Birthday: req.body.Birthday
		}
	},
	{ new: true }, // Returns the updated document
	(error, updatedUser) => {
		if (error) {
			console.error(error);
			res.status(500).send('Error: ' + error);
		} else {
			res.status(201).json(updatedUser);
		}
	});
});

// Add a movie to user's favorites
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username }, {
		$push: { FavoriteMovies: req.params.MovieID }
	},
	{ new: true }, // Returns the updated document
	(err, updatedUser) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(updatedUser);
		}
	});
});

// Delete a movie from user's favorites
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username }, {
		$pull: { FavoriteMovies: req.params.MovieID }
	},
	{ new: true }, // Returns the updated document
	(err, updatedUser) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(updatedUser);
		}
	});
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
	.then((user) => {
		if (!user) {
			res.status(400).send(req.params.Username + ' was not found');
		} else {
			res.status(200).send(req.params.Username + ' was successfully deregistered.');
		}
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
	console.log('Listening on Port ' + port);
});
