const express = require('express');
const partnersRouter = express.Router();

partnersRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	.get((req, res) => {
		res.end('Will return partners data');
	})
	.post((req, res) => {
		res.end(
			`Will add partner: ${req.body.name} \nwith description: ${req.body.description}`
		);
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.end(`PUT operation is not supported`);
	})
	.delete((req, res) => {
		res.end('Deleting all partners');
	});

//-------
// Campsite
//-------

partnersRouter
	.route('/:partnerId')
	.get((req, res) => {
		res.end(`Will send details about ${req.params.partnerId} to you`);
	})
	.post((req, res) => {
		res.statusCode = 403;
		res.end(
			`POST operation not supported on /partners/${req.params.partnerId}`
		);
	})
	.put((req, res) => {
		res.write(`Updating partner: ${req.params.partnerId}\n`);
		res.end(
			`Will update the partner: ${req.body.name} with description ${req.body.description}`
		);
	})
	.delete((req, res) => {
		res.end(`Deleting partner: ${req.params.partnerId}`);
	});

module.exports = partnersRouter;
