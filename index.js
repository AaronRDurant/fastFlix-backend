const express = require('express');
	morgan = require('morgan');
	
const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

let topTenMovies = [
	{
		title: 'Rush',
		cast: 'Daniel Bruhl, Chris Hemsworth',
	},
	{
		title: 'Le Mans',
		cast: 'Steve McQueen, Luc Merenda',
	},
	{
		title: 'Days of Thunder',
		cast: 'Tom Cruise, Nicole Kidman',
	},
	{
		title: 'The Fast and the Furious',
		cast: 'Vin Diesel, Michelle Rodriguez',
	},
	{
		title: 'Bullitt',
		cast: 'Robert Duvall, Steve McQueen',
	},
	{
		title: 'Grand Prix',
		cast: 'James Garner, Eva Marie Saint',
	},
	{
		title: 'Need for Speed',
		cast: 'Michael Keaton, Dakota Johnson',
	},
	{
		title: 'The Fast and the Furious: Tokyo Drift',
		cast: 'Vin Diesel, Bow Wow',
	},
	{
		title: 'Talladega Nights: The Ballad of Ricky Bobby',
		cast: 'Will Ferrell, John C. Reilly',
	},
	{
		title: 'Ford v. Ferrari',
		cast: 'Christian Bale, Matt Damon',
	},
];

app.get('/', (req, res) => {
  res.send('Welcome to fastFlix!');
});

// Get a list of data about all movies
app.get('/movies', (req, res) => {
  res.send('Successful GET request returning data on all movies');
 });

// Get data about a movie by title
app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returning data on movie title: ' + req.params.title);
 });

// Get data about a genre by title
app.get('/movies/genres/:genre', (req, res) => {
  res.send('Successful GET request returning data on genre: ' + req.params.genre);
 });

// Get data about a director by name
app.get('/movies/directors/:name', (req, res) => {
  res.send('Successful GET request returning data on director: ' + req.params.name);
});

// Register new user
app.post('/users', (req, res) => {
  res.send('Successful POST request registering new user');
});

// Update user information
app.put('/users/:username', (req, res) => {
  res.send('Successful PUT request updating information for user: ' + req.params.username);
});

// Post new movie to  list of user's favorite movies
app.post('/users/:username/movies/:movieID', (req, res) => {
  res.send('Successful POST request adding movie with ID: ' + req.params.movieID + ' to favorite movie list of User: ' + req.params.username);
});

// Delete a movie from list of user's favorite movies
app.delete('/users/:username/movies/:movieID', (req, res) => {
  res.send('Successful DELETE request removing movie with ID: ' + req.params.movieID + ' from favorite movie list of User: ' + req.params.username);
});

// Delete a user
app.delete('/users/:username', (req, res) => {
  res.send('Successful DELETE request removing User: ' + req.params.username + ' from database');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () =>
  console.log('Your app is listening on port 8080.'));
