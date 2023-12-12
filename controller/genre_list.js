const { loadHtml } = require('../utils/loader');

async function getGenres() {
	const $ = await loadHtml(`${global.SAMEHADAKU_URL}/daftar-anime-2/?order=latest&status=&type=`);
	const genres = $('tr.filter_tax').map(function() {
		if($(this).children('.filter_title').text() != 'Genre') return;
		return $(this).children('.filter_act').children('.tax_fil').map(function() {
			return $(this).text().trim();
		}).toArray();
	}).toArray().flat();
	
	return genres.map(el => ({
		name: el,
		id: el.toLowerCase().replace(/ /g, '-')
	}))
}

module.exports = getGenres;