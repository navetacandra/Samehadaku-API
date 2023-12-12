const { loadHtml } = require('../utils/loader');

async function getDetails(slug) {
	const $ = await loadHtml(`${global.SAMEHADAKU_URL}/anime/${slug}`);
	if($('.infoanime').length < 1) return {};

	const title = $('.entry-title').text().replace('Nonton Anime ', '');
	const poster = $('.thumb img').attr('src');
	const ratingValue = Number($('[itemprop="ratingValue"]').text());
	const ratingCount = Number($('[itemprop="ratingCount"]').text().replace(/[^0-9]/g, ''));
	const description = $('[itemprop="description"]').text().trim();
	const duration = $('.spe span').filter(function() {
		return $(this).text().includes('Duration');
	}).first().text().replace('Duration ', '');
	const studio = $('.spe span').filter(function() {
		return $(this).text().includes('Studio');
	}).first().text().replace('Studio ', '');
	const status = $('.spe span').filter(function() {
		return $(this).text().includes('Status');
	}).first().text().replace('Status ', '');
	const source = $('.spe span').filter(function() {
		return $(this).text().includes('Source');
	}).first().text().replace('Source ', '');

	const genres = $('.genre-info a').map(function() {
		return $(this).text();
	}).toArray();

	const episodes = $('.lstepsiode.listeps > ul > li').map(function() {
		const eps = $(this).children('.epsright').text();
		const title = $(this).children('.epsleft').children('.lchx').children('a').text();
		const slug = $(this).children('.epsleft').children('.lchx').children('a').attr('href').replace(`${global.SAMEHADAKU_URL}/`, '').replace('/', '');
		const release = $(this).children('.epsleft').children('.date').text();
		
		return { eps, title, slug, release, type: 'stream-room' };
	}).toArray();

	return {
		title,
		poster,
		duration,
		studio,
		status,
		source,
		ratingValue,
		ratingCount,
		description,
		genres,
		episodes
	};
}

module.exports = getDetails;