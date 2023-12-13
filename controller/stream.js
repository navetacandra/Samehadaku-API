const { loadHtml, loadHtmlString, fetch } = require('../utils/loader');

async function stream(slug) {
	const $ = await loadHtml(`${global.SAMEHADAKU_URL}/${slug}`);
	if($('.player-area').length < 1) return {};
	
	const data = $('#server li').map(async function() {
		const player = $(this).children('div')
		const post = player.data('post');
		const nume = player.data('nume');
		const type = player.data('type');

		try {
			let res = await fetch(`${global.SAMEHADAKU_URL}/wp-admin/admin-ajax.php`, {
				headers: {
					authority: 'samehadaku.guru',
					accept: '*/*',
					'accept-language': 'en-US,en;q=0.9,id;q=0.8',
					'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
					cookie: '_ga=GA1.1.1315498486.1702297385; _ga_85V0GD905H=GS1.1.1702338386.3.1.1702341813.0.0.0',
					dnt: '1',
					origin: 'https://samehadaku.guru',
	  				referer: `https://samehadaku.guru/${slug}}/`,
	  				'x-requested-with': 'XMLHttpRequest'
				},
				method: 'POST',
				body: `action=player_ajax&post=${post}&nume=${nume}&type=${type}`
			});
			const iframe = await res.text();
			return {
				label: player.text().trim(),
				url: loadHtmlString(iframe)('iframe').attr('src')
			};
		} catch(err) {
			console.log(`[ERROR] Error get embed ${slug}`)
			return null;
		}
	}).toArray();

	return {
		title: $('h1.entry-title').text(),
		embed: await Promise.all(data)
	};
}

module.exports = stream;