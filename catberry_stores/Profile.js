'use strict';

module.exports = Profile;

var api_config = require('../config/api-config');

/*
 * This is a Catberry Store file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#stores
 */

/**
 * Creates new instance of the "profile" store.
 * @param {UHR} $uhr Universal HTTP request.
 * @constructor
 */
function Profile($uhr) {
	this._uhr = $uhr;
}

/**
 * Current universal HTTP request to do it in isomorphic way.
 * @type {UHR}
 * @private
 */
Profile.prototype._uhr = null;

/**
 * Current lifetime of data (in milliseconds) that is returned by this store.
 * @type {number} Lifetime in milliseconds.
 */
Profile.prototype.$lifetime = 60000;

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
Profile.prototype.load = function () {
	// Here you can do any HTTP requests using this._uhr.
	// Please read details here https://github.com/catberry/catberry-uhr.
	var id = this.$context.state.id;
	var hash = this.$context.state.hash;
	if (!id || !hash) {
		return;
	}
	var url = encodeURI(api_config.apiUrl + '/profile?key=' + api_config.apiKey + '&version=' + api_config.apiVersion + '&id=' + id + '&hash=' + hash);

	return this._uhr.get(url)
		.then(function (result) {
			if (result.status.code >= 400 && result.status.code < 600) {
				throw new Error(result.status.text);
			}
			result.content.hasResults = (result.content.id > 0);

			var markers = [];
			if (result.content.lat && result.content.lon) markers.push({point: {lat: result.content.lat, lon: result.content.lon}, text: result.content.name});
			result.content.markers = JSON.stringify(markers);
			result.content.firm_group_flag = (result.content.firm_group.count > 1);

			var websites = [], emails = [], phones = [];
			result.content.contacts.forEach(function (item) {
				item.contacts.forEach(function (item2) {
					if (item2.type == "website") websites.push({'alias' : item2.alias, 'value' : item2.value});
					if (item2.type == "email") emails.push(item2.value);
					if (item2.type == "fax") phones.push(item2.value);
					if (item2.type == "phone") phones.push(item2.value);
				});
			});
			result.content.websites = websites;
			result.content.emails = emails;
			result.content.phones = phones;

			return result.content;
		});
};

