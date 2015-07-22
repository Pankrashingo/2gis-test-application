'use strict';

module.exports = SearchGeoForm;

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "search-firm-form" component.
 * @constructor
 */
function SearchGeoForm() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
SearchGeoForm.prototype.render = function () {
	return this.$context.getStoreData();
};

/**
 * Returns event binding settings for the component.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
 */
SearchGeoForm.prototype.bind = function () {
	this.hideLoader();
	return {
		submit: {
			form: this._handleFormSubmit
		}
	};
};

/**
 * Handles click on submit button.
 * @private
 */
SearchGeoForm.prototype._handleFormSubmit = function (event) {
	event.preventDefault();
	event.stopPropagation();
	this.showLoader();
	this.$context.redirect('/geo?q=' + this.getQuery('query'));
};

/**
 * Gets current specified query.
 * @returns {string}
 */
SearchGeoForm.prototype.getQuery = function (name) {
	return this.$context.element
		.querySelector('input[name=' + name + ']')
		.value;
};

/**
 * Hides loader in template.
 */
SearchGeoForm.prototype.hideLoader = function () {
	var loaders = this.$context.element.getElementsByTagName('cat-loader');
	for(var i = 0; i < loaders.length; i++) {
		loaders[i].style.display = 'none';
	}
};

/**
 * Shows loader in template.
 */
SearchGeoForm.prototype.showLoader = function () {
	var loaders = this.$context.element.getElementsByTagName('cat-loader');
	for(var i = 0; i < loaders.length; i++) {
		loaders[i].style.display = '';
	}
};
