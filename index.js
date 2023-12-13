require('dotenv').config();
global.SAMEHADAKU_URL = process.env.SAMEHADAKU_URL;

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const app = express();
const controller = {};
const port = process.env.PORT || 5000;

app.use(cors({ origin: '*' }))
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', '');
  next();
});

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
	filesPattern: './swagger.js',
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