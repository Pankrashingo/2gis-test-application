'use strict';

module.exports = SearchGeoResults;

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "search-firm-results" component.
 * @constructor
 */
function SearchGeoResults() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
SearchGeoResults.prototype.render = function () {
	return this.$context.getStoreData();
};

/**
 * Returns event binding settings for the component.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
 */
SearchGeoResults.prototype.bind = function () {
	if (document.getElementById('map')) {
		this.$context.getStoreData().then(function (value) {
			DG.then(function () {
				var map;
				var selection, centroid;

				var coordinates_json = JSON.parse(value.markers);
				coordinates_json.forEach(function (item) {
					selection = DG.Wkt.toLatLngs(item.selection);
					centroid = DG.Wkt.toLatLngs(item.centroid);
				});

				map = DG.map('map', {
					center: centroid[0],
					zoom: 12
				});

				if (selection.length > 1) {
					var polyline = DG.polyline(selection, {
						color: 'blue'
					}).addTo(map);
					map.fitBounds(polyline.getBounds());
				} else {
					DG.marker(selection[0]).addTo(map);
				}
			});
		});
	}
};