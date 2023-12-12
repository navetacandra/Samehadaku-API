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

/**
 * GET /recommendation/{page}
 * @summary Fetch Anime List
 * @tags Anime
 * @param {number} page.path - The recommendation page.
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */

/**
 * GET /latest
 * @summary Fetch Latest Post
 * @tags Anime
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */

/**
 * GET /search
 * @summary Search Anime
 * @tags Anime
 * @param {string} q.query - Search query
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */

/** 
 * GET /genre
 * @summary Fetch Genre List
 * @tags Anime
 * @return {GenresResponse} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */

/**
 * GET /genre/{genre}
 * @summary Search Anime by Genre
 * @tags Anime
 * @param {string} genre.path - Search genre
 * @return {array<BasicResponse>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 */

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