'use strict';

module.exports = Geo;

var api = require('../../config/api-config');

/*
 * This is a Catberry Store file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#stores
 */

/**
 * Creates new instance of the "search/Geo" store.
 * @param {UHR} $uhr Universal HTTP request.
 * @constructor
 */
function Geo($uhr) {
	this._uhr = $uhr;
}

/**
 * Current universal HTTP request to do it in isomorphic way.
 * @type {UHR}
 * @private
 */
Geo.prototype._uhr = null;

/**
 * Current lifetime of data (in milliseconds) that is returned by this store.
 * @type {number} Lifetime in milliseconds.
 */
Geo.prototype.$lifetime = 60000;

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
Geo.prototype.load = function () {
	// Here you can do any HTTP requests using this._uhr.
	// Please read details here https://github.com/catberry/catberry-uhr.

	var query = this.$context.state.query;
	if (!query) {
		return;
	}
	var url = encodeURI(api.apiUrl + '/geo/search?key=' + api.apiKey + '&version=' + api.apiVersion + '&q=' + query);

	return this._uhr.get(url)
		.then(function (result) {
			if (result.status.code >= 400 && result.status.code < 600) {
				throw new Error(result.status.text);
			}
			result.content.query = query;
			result.content.hasResults = (result.content.total > 0);

			if (result.content.total > 0) {
				var markers = [];
				result.content.result.forEach(function (item) {
					if (item.selection) markers.push({selection: item.selection, centroid: item.centroid});
				});
				result.content.markers = JSON.stringify(markers);
			}

			return result.content;
		});
};

