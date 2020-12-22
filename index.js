const mongoose = require('mongoose');
	Models = require('./models.js');
	morgan = require('morgan');
	express = require('express');
	bodyParser = require('body-parser');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movies', {
useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

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
app.get('/users', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
	Users.findOne({ Username: req.params.Username })
	.then((user) => {
		res.json(user);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get data about a movie by title
app.get('/movies/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title})
	.then((movie) => {
		res.status(201).json(movie);
	})
	.catch((err) => {
		console.err(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get data about a genre by title
app.get('/movies/Genres/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title})
	.then((movie) => {
		res.status(201).json(movie.Genre.Name + ": " + movie.Genre.Description);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

// Get data about a director by name
app.get('/movies/Directors/:Name', (req, res) => {
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
/* Expecting JSON in the following format:
{
	ID: Integer,
	Username: String,
	Password: String,
	Email: String,
	Birthday: Date
}*/
app.post('/users', (req, res) => {
	Users.findOne({ Username: req.body.Username })
	.then((user) => {
		if (user) {
			return res.status(400).send(req.body.Username + 'already exists');
		} else {
			Users
			.create({
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday
			})
			.then((user) =>{res.status(201).json(user) })
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error: ' + error);
			})
		}
	})
	.catch((error) => {
		console.error(error);
		res.status(500).send('Error: ' + error);
	});
});

// Update a user's info, by username
/* Expecting JSON in the following format:
{
	Username: String,
	Password: String,
	Email: String,
	Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username }, {
		$set:
		{
			Username: req.body.Username,
			Password: req.body.Password,
			Email: req.body.Email,
			Birthday: req.body.Birthday
		}
	},
	{ new: true }, // Returns the updated document
	(err, updatedUser) => {
		if(err) {
			console.error(err);
			res.status(500).send('Error: ' + err);
		} else {
			res.json(updatedUser);
		}
	});
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
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

// Delete a movie from a user's list of favorites
app.delete('/users/:Username/Movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
	.then((user) => {
		if (!user) {
			res.status(400).send(req.params.Username + ' was not found');
		} else {
			res.status(200).send(req.params.Username + ' was deleted.');
		}
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	});
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something is wrong!');
});

app.listen(8080, () =>
console.log('Your app is listening on port 8080.'));
