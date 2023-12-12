const { loadHtml } = require('../utils/loader');

async function getLatest() {
	const $ = await loadHtml(global.SAMEHADAKU_URL);
	const section = $('.widget_senction')
		.filter(function() {
			return $(this).children('.widget-title').text() == 'Anime Terbaru';
		})[0];

	const data = $(section)
		.children('.post-show')
		.children('ul')
		.children('li')
		.map(function() {
			const title = $(this).children('.dtla').children('.entry-title').text();
			const slug = $(this).children('.thumb').children('a').attr('href').replace(global.SAMEHADAKU_URL, '').replace(/\//g, '')
			const poster = $(this).children('.thumb').children('a').children('img').attr('src')
			return {
				title,
				poster,
				slug,
				type: 'stream-room'
			};
		}).toArray();

	return data;
}

module.exports = getLatest;