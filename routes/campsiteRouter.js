const express = require('express');
const campsiteRouter = express.Router();

campsiteRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	.get((req, res) => {
		res.end('Will return campsites data');
	})
	.post((req, res) => {
		res.end(
			`Will add campsite: ${req.body.name} \nwith description: ${req.body.description}`
		);
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.end(`PUT operation is not supported`);
	})
	.delete((req, res) => {
		res.end('Deleting all campsites');
	});

//-------
// Campsite
//-------

campsiteRouter
	.route('/:campsiteId')
	.get((req, res) => {
		res.end(`Will send details about ${req.params.campsiteId} to you`);
	})
	.post((req, res) => {
		res.statusCode = 403;
		res.end(
			`POST operation not supported on /campsites/${req.params.campsiteId}`
		);
	})
	.put((req, res) => {
		res.write(`Updating campsite: ${req.params.campsiteId}\n`);
		res.end(
			`Will update the campsite: ${req.body.name} with description ${req.body.description}`
		);
	})
	.delete((req, res) => {
		res.end(`Deleting campsite: ${req.params.campsiteId}`);
	});

module.exports = campsiteRouter;
