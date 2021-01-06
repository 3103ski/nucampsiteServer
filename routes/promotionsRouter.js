const express = require('express');
const promotionsRouter = express.Router();

promotionsRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text');
		next();
	})
	.get((req, res) => {
		res.end('Will return promotions data');
	})
	.post((req, res) => {
		res.end(
			`Will add promotions: ${req.body.name}\nwith description: ${req.body.description}`
		);
	})
	.put((req, res) => {
		res.statusCode = 403;
		res.end('PUT operation is not supported');
	})
	.delete((req, res) => {
		res.end('Deleting all promotions');
	});

//-------
// Promotion
// --------

promotionsRouter
	.route('/:promotionId')
	.get((req, res) => {
		res.end(`Will send details about ${req.params.promotionId}`);
	})
	.post((req, res) => {
		res.statusCode = 403;
		res.end(
			`POST operation is not support on /promotions/${req.params.promotionId}`
		);
	})
	.put((req, res) => {
		res.write(`Updating promotion: ${req.params.promotionId}\n`);
		res.end(
			`Will update the promotion: ${req.body.name} with description ${req.body.description}`
		);
	})
	.delete((req, res) => {
		res.end(`Deleting promotion: ${req.params.promotionId}`);
	});

module.exports = promotionsRouter;
