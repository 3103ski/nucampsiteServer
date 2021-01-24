const express = require('express');
const mongoose = require('mongoose');
const Favorite = require('../models/favorite');
const Campsite = require('../models/campsite');
const favoritesRouter = express.Router();

const cors = require('./cors');
const auth = require('../authenticate');

function cast(id) {
	return mongoose.Types.ObjectId(id);
}

favoritesRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		Favorite.find({ user: req.user._id })
			.populate('user')
			.populate('campsites')
			.then((favorites) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(favorites);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favProfile) => {
				if (favProfile) {
					const incomingIDs = req.body;
					incomingIDs.forEach((objectId) => {
						if (!favProfile.campsites.includes(objectId._id)) {
							favProfile.campsites.push(objectId._id);
						}
					});
					favProfile.save();
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favProfile);
				} else {
					Favorite.create({ user: req.user, campsites: req.body })
						.then((newProfile) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(newProfile);
						})
						.catch((err) => next(err));
				}
			})
			.catch((err) => next(err));
	})
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		Favorite.findOneAndDelete({ user: req.user._id })
			.then((response) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(response);
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('Operation not supported at this endpoint');
	});

favoritesRouter
	.route('/:campsiteId')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.delete(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favoriteProfile) => {
				Campsite.findById(req.params.campsiteId)
					.then((campsite) => {
						const updatedFavorites = favoriteProfile.campsites.filter((favorite) => {
							return favorite.equals(campsite._id) ? null : favorite._id;
						});
						favoriteProfile.campsites = updatedFavorites;
						favoriteProfile.save();
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favoriteProfile);
					})
					.catch((err) => next(err));
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id })
			.then((favoritesProfile) => {
				if (favoritesProfile) {
					Campsite.findById(req.params.campsiteId)
						.then((campsite) => {
							if (
								campsite &&
								!favoritesProfile.campsites.filter((campsite) =>
									campsite._id.equals(req.params.campsiteId) ? campsite._id : null
								)[0]
							) {
								favoritesProfile.campsites.push(cast(campsite._id));
								favoritesProfile.save();
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(favoritesProfile);
							} else if (!campsite) {
								res.statusCode = 404;
								res.end('The campsite you are trying to favorite does not exist');
							} else {
								res.statusCode = 404;
								res.end('This campsite is already a favorite');
							}
						})
						.catch((err) => {
							res.statusCode = 404;
							res.setHeader('Content-Type', 'application/json');
							res.json({
								mongooseErr: err,
								errorMsg: 'The campsite ID you endered to favorite is not a valid ID',
							});
						});
				} else {
					Favorite.create({ user: req.user._id }).then((favoritesProfile) => {
						Campsite.findOne({ _id: req.params.campsiteId })
							.then((campsite) => {
								if (campsite) {
									favoritesProfile.campsites.push(cast(campsite._id));
									favoritesProfile.save();
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(favoritesProfile);
								} else {
									res.statusCode = 403;
									res.end('The campsite you are trying to favorite does not exist');
								}
							})
							.catch((err) => next(err));
					});
				}
			})
			.catch((err) => next(err));
	})
	.put(cors.corsWithOptions, auth.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('Operation not supported at this endpoint');
	})
	.get(cors.cors, auth.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('Operation not supported at this endpoint');
	});

module.exports = favoritesRouter;
