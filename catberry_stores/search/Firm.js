'use strict';

module.exports = Firm;

var Paginator = require("paginator");
var api_config = require('../../config/api-config');

/*
 * This is a Catberry Store file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#stores
 */

/**
 * Creates new instance of the "search/Firm" store.
 * @param {UHR} $uhr Universal HTTP request.
 * @constructor
 */
function Firm($uhr) {
	this._uhr = $uhr;
}

/**
 * Current universal HTTP request to do it in isomorphic way.
 * @type {UHR}
 * @private
 */
Firm.prototype._uhr = null;

/**
 * Current lifetime of data (in milliseconds) that is returned by this store.
 * @type {number} Lifetime in milliseconds.
 */
Firm.prototype.$lifetime = 60000;

/**
 * Loads data from remote source.
 * @returns {Promise<Object>|Object|null|undefined} Loaded data.
 */
Firm.prototype.load = function () {
	// Here you can do any HTTP requests using this._uhr.
	// Please read details here https://github.com/catberry/catberry-uhr.
	var what = this.$context.state.what;
	var where = this.$context.state.where;
	var rubric = this.$context.state.rubric;
	var page = this.$context.state.page;

	var for_search = 'search';
	if (!page) page = 1;
	if (!what && rubric) {
		what = rubric;
		for_search = 'searchinrubric';
	}
	if ((!what && !rubric) || !where) {
		return;
	}

	var url = encodeURI(api_config.apiUrl + '/' + for_search + '?key=' + api_config.apiKey + '&version=' + api_config.apiVersion + '&what=' + what + '&where=' + where + '&page=' + page);

	return this._uhr.get(url)
		.then(function (result) {
			if (result.status.code >= 400 && result.status.code < 600) {
				throw new Error(result.status.text);
			}

			result.content.where = where;
			result.content.page = page;
			result.content.hasResults = (result.content.total > 0);

			if (result.content.total > 0) {
				var paginator = new Paginator(20, 5);
				var pagination_info = paginator.build(parseInt(result.content.total), parseInt(page));

				if (result.content.total > 20) {
					var paginator_url = '/firm?what=' + what + '&where=' + where;
					var paginator_html = '<ul class="pagination">';
					if (pagination_info.has_previous_page) paginator_html += '<li><a onclick="return up();" href="' + paginator_url + '&page=' + pagination_info.previous_page + '">Предыдущая</a></li>';
					for (var i = pagination_info.first_page; i <= pagination_info.last_page; i++)
						paginator_html += '<li ' + ((i == pagination_info.current_page) ? 'class="active"' : '') + '><a onclick="return up();" href="' + paginator_url + '&page=' + i + '">' + i + '</a></li>';
					if (pagination_info.has_next_page) paginator_html += '<li><a onclick="return up();" href="' + paginator_url + '&page=' + pagination_info.next_page + '">Следующая</a></li>';
					paginator_html += '</ul>';
					result.content.paginator = paginator_html;
				}

				var markers = [];
				result.content.result.forEach(function (item, i) {
					if (item.lat && item.lon) markers.push({point: {lat: item.lat, lon: item.lon}, text: item.name});
					item.number = pagination_info.first_result + i + 1;
					item.firm_group_flag = (item.firm_group.count > 1);
				});
				result.content.markers = JSON.stringify(markers);
			}

			return result.content;
		});
};