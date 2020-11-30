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

app.get('/', (req, res)> {
	res.send('Welcome to fastFlix!');
});

app.get('/movies', (req, res) => {
	res.json(topTenMovies);
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong.');
});

app.listen(8080, () => console.log('Your app is listening on port 8080.'));
