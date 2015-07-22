'use strict';

module.exports = Filials;

var api_config = require('../config/api-config');

/*
 * This is a Catberry Store file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#stores
 */

/**
 * Creates new instance of the "filial" store.
 * @param {UHR} $uhr Universal HTTP request.
 * @constructor
 */
function Filials($uhr) {
	this._uhr = $uhr;
}

/**
 * Current universal HTTP request to do it in isomorphic way.
 * @type {UHR}
 * @private
 */
Filials.prototype._uhr = null;

/**
 * Current lifetime of data (in milliseconds) that is returned by this store.
 * @type {number} Lifetime in milliseconds.
 */
Filials.prototype.$lifetime = 60000;

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
Filials.prototype.load = function () {
	// Here you can do any HTTP requests using this._uhr.
	// Please read details here https://github.com/catberry/catberry-uhr.
	var firm_id = this.$context.state.firm_id;
	if (!firm_id) {
		return;
	}
	var url = encodeURI(api_config.apiUrl + '/firmsByFilialId?key=' + api_config.apiKey + '&version=' + api_config.apiVersion + '&firmid=' + firm_id);

	return this._uhr.get(url)
		.then(function (result) {
			if (result.status.code >= 400 && result.status.code < 600) {
				throw new Error(result.status.text);
			}
			result.content.hasResults = (result.content.total > 0);

			var markers = [];
			result.content.result.forEach(function(v){
				markers.push({point : {lat : v.lat, lon : v.lon}, text : v.name});
			});
			result.content.markers = JSON.stringify(markers);

			return result.content;
		});
};

