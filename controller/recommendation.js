const { loadHtml } = require('../utils/loader');

async function getRecommendation(page = 1) {
	const $ = await loadHtml(`${global.SAMEHADAKU_URL}/anime-rekomendasi/page/${page}`);
	const currentPage = Number($('.page-numbers.current').first().text());
	const maxPage = Number($('.pagination span').first().text().match(/Page (.*) of (.*)/)[2] ?? '0');

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

	return { currentPage, maxPage, data };
}

module.exports = getRecommendation;