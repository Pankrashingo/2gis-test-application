'use strict';

module.exports = Filials;

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "filial" component.
 * @constructor
 */
function Filials() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
Filials.prototype.render = function () {
	return this.$context.getStoreData();
};

/**
 * Returns event binding settings for the component.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
 */
Filials.prototype.bind = function () {
	this.$context.getStoreData().then(function(value) {
		DG.then(function () {
			var map, markers = DG.featureGroup();

			map = DG.map('map', {
				center: [54.98, 82.89],
				zoom: 12
			});

			var coordinates_json = JSON.parse(value.markers);
			coordinates_json.forEach(function (item, i, arr) {
				DG.marker(item.point).addTo(markers).bindPopup(item.text);
			});

			markers.addTo(map);

			map.fitBounds(markers.getBounds());
		});
	});
};

/**
 * Does cleaning for everything that have NOT been set by .bind() method.
 * This method is optional.
 * @returns {Promise|undefined} Promise or nothing.
 */
Filials.prototype.unbind = function () {

};