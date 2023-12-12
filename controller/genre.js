const { loadHtml } = require('../utils/loader');

async function getByGenre(genre_id='action') {
	const $ = await loadHtml(`${global.SAMEHADAKU_URL}/daftar-anime-2/?order=latest&status=&type=&genre[]=${encodeURIComponent(genre_id)}`);

	const data = $('.animposx a').map(function() {
		const title = $(this).attr('title');
		const slug = $(this).attr('href').replace(`${global.SAMEHADAKU_URL}/`, '').replace('anime/', '').replace('/', '');
		const poster = $(this).children('.content-thumb').children('img').attr('src');
		const showType = $(this).children('.content-thumb').children('.type').text();
		const rate = Number($(this).children('.content-thumb').children('.score').text().trim());
		const status = $(this).children('.data').children('.type').text().trim();

		return {
			title, slug, poster, showType, rate, status, type: 'anime-card'
		};
	}).toArray();

	return data;
}

module.exports = getByGenre;