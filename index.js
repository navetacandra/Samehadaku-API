require('dotenv').config();
global.SAMEHADAKU_URL = process.env.SAMEHADAKU_URL;

const fs = require('fs');
const path = require('path');
const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const app = express();
const controller = {};
const port = process.env.PORT || 5000;

const options = {
	info: {
		version: '1.0.0',
		title: 'SAMEHADAKU API',
		description: "This is a Samehadaku API which data scraped from official Samehadaku site.",
		contact: {
			name: "navetacandra",
			url: "https://navetacandra.github.io",
			email: "naveta.cand@gmail.com",
		},
	},
	filesPattern: './index.js',
	baseDir: __dirname,
	security: {
		BasicAuth: {
			type: 'http',
			scheme: 'basic',
		},
	}
};

expressJSDocSwagger(app)(options);

fs.watch(path.join(__dirname, 'controller'), (ev, f) => {
	if(!f.endsWith('.js')) return;
	const fname = path.join(__dirname, 'controller', f);

	if(!fs.existsSync(fname)) {
		if(Object.keys(require.cache).filter(f => f.includes(fname)).length) {
			delete require.cache[fname];
			delete controller[f.replace('.js')];
		}
		
		console.log(`[MODULE] Delete ${fname}`);
	} else {
		if(Object.keys(require.cache).filter(f => f.includes(fname)).length) {
			delete require.cache[fname];
			controller[f.replace('.js', '')] = require(fname);
		}
		
		console.log(`[MODULE] Reload ${fname}`);
	}
});

fs.readdirSync(path.join(__dirname, 'controller')).filter(f => f.endsWith('.js')).forEach(f => {
	const fname = path.join(__dirname, 'controller', f);
	controller[f.replace('.js', '')] = require(fname);
});

/**
 * @typedef {object} BasicResponse
 * @property {string} status
 * @property {array<AnimeCard>} result
 */

/**
 * @typedef {object} GenresResponse
 * @property {string} status
 * @property {array<Genre>} result
 */

/**
 * @typedef {object} DetailsResponse
 * @property {string} status
 * @property {AnimeDetail} result
 */

/**
 * @typedef {object} StreamResponse
 * @property {string} status
 * @property {array<Stream>} result
 */

/**
 * @typedef {object} ErrorResponse
 * @property {string} status
 * @property {string} message
 */

/**
 * @typedef {object} Genre
 * @property {string} id - Genre id
 * @property {string} name - Genre name
 */

/**
 * @typedef {object} Stream
 * @property {string} label - Stream label
 * @property {string} url - Stream url
 */

/**
 * @typedef {object} AnimeCard
 * @property {string} title - Anime title
 * @property {string} slug - Item slug
 * @property {string} poster - Item poster
 * @property {number} rate - Anime rate
 * @property {string} status - Anime status
 * @property {string} type - Anime type
 */

/**
 * @typedef {object} Episode
 * @property {string} eps
 * @property {string} title
 * @property {string} slug
 * @property {string} release
 * @property {string} type
 */

/**
 * @typedef {object} AnimeDetail
 * @property {string} title - Anime title
 * @property {string} poster - Anime poster
 * @property {string} duration - Anime duration
 * @property {string} studio - Anime studio
 * @property {string} status - Anime status
 * @property {string} source - Source
 * @property {number} ratingValue - Anime rate
 * @property {number} ratingCount - Anime rate count
 * @property {string} description - Anime description
 * @property {string} genres - Anime genres
 * @property {array<Episode>} episodes - Anime episodes
*/

/**
 * GET /
 * @summary Featured Anime
 * @tags Anime
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/', async (req, res) => {
	try {
		const recommendation = await controller.recommendation();

		return res.json({
			status: 'success',
			result: recommendation.data
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

/**
 * GET /recommendation/{page}
 * @summary Fetch Anime List
 * @tags Anime
 * @param {number} page.path - The recommendation page.
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/recommendation/:page', async (req, res) => {
	try {
		const recommendation = await controller.recommendation(req.params.page ?? 1);

		return res.json({
			status: 'success',
			result: recommendation.data
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

/**
 * GET /latest
 * @summary Fetch Latest Post
 * @tags Anime
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/latest', async (req, res) => {
	try {
		const latest = await controller.latest();

		return res.json({
			status: 'success',
			result: latest
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

/**
 * GET /search
 * @summary Search Anime
 * @tags Anime
 * @param {string} q.query - Search query
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/search', async (req, res) => {
	if(!req.query.q || req.query.q.length < 1) {
		return res.json({
			status: 'error',
			message: 'Parameter not complete'
		}).status(400);
	}

	try {
		const search = await controller.search(req.query.q);

		return res.json({
			status: 'success',
			result: search
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

/** 
 * GET /genre
 * @summary Fetch Genre List
 * @tags Anime
 * @return {GenresResponse} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/genre', async (req, res) => {
	try {
		const genres = await controller.genre_list();

		return res.json({
			status: 'success',
			result: genres
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

/**
 * GET /genre/{genre}
 * @summary Search Anime by Genre
 * @tags Anime
 * @param {string} genre.path - Search genre
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/genre/:genre', async (req, res) => {
	try {
		const genres = await controller.genre(req.params.genre);

		return res.json({
			status: 'success',
			result: genres
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

/**
 * GET /details
 * @summary Fetch Anime Details
 * @tags Anime
 * @param {string} id.query - Movie id
 * @return {array<DetailsResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 400 - error response - application/json
 * @return {ErrorResponse} 404 - error response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/details', async (req, res) => {
	if(!req.query.id || req.query.id.length < 1) {
		return res.json({
			status: 'error',
			message: 'Parameter not complete'
		}).status(400);
	}

	try {
		const details = await controller.details(req.query.id);

		if(Object.keys(details).length < 1) {
			return res.json({
				status: 'error',
				message: 'Item not found'
			}).status(404);
		}

		return res.json({
			status: 'success',
			result: details
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

/**
 * GET /stream
 * @summary Fetch Stream List
 * @tags Anime
 * @param {string} id.query - Episode/item id
 * @return {array<StreamResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 400 - error response - application/json
 * @return {ErrorResponse} 404 - error response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */
app.get('/stream', async (req, res) => {
	if(!req.query.id || req.query.id.length < 1) {
		return res.json({
			status: 'error',
			message: 'Parameter not complete'
		}).status(400);
	}

	try {
		const stream = await controller.stream(req.query.id);

		if(Object.keys(stream).length < 1) {
			return res.json({
				status: 'error',
				message: 'Item not found'
			}).status(404);
		}

		return res.json({
			status: 'success',
			result: stream
		}).status(200);
	} catch(err) {
		return res.json({
			status: 'error',
			message: err.toString()
		}).status(500);
	}
})

app.listen(port, console.log(`Running in port: ${port}`));