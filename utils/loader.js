const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch')
	.then(({ default: f }) => f(...args))
	.catch(err => err);

async function loadHtml(url) {
	try {
		const html = await (await fetch(url)).text();
		return cheerio.load(html);
	} catch (err) {
		console.log(`[ERROR] Error load html in ${url}:\n${err}`);
		return err;
	}
}

function loadHtmlString(html) {
	try {
		return cheerio.load(html);
	} catch (err) {
		console.log(`[ERROR] Error load html in ${html}:\n${err}`);
		return err;
	}
}

module.exports = {
	fetch,
	loadHtml,
	loadHtmlString
};