'use strict';

module.exports = SearchFirmForm;

/*
 * This is a Catberry Cat-component file.
 * More details can be found here
 * https://github.com/catberry/catberry/blob/master/docs/index.md#cat-components
 */

/**
 * Creates new instance of the "search-firm-form" component.
 * @constructor
 */
function SearchFirmForm() {

}

/**
 * Gets data context for template engine.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Data context
 * for template engine.
 */
SearchFirmForm.prototype.render = function () {
	return this.$context.getStoreData();
};

/**
 * Returns event binding settings for the component.
 * This method is optional.
 * @returns {Promise<Object>|Object|null|undefined} Binding settings.
 */
SearchFirmForm.prototype.bind = function () {
	this.hideLoader();
	return {
		submit: {
			form: this._handleFormSubmit
		}
	};
};

/**
 * Does cleaning for everything that have NOT been set by .bind() method.
 * This method is optional.
 * @returns {Promise|undefined} Promise or nothing.
 */
SearchFirmForm.prototype.unbind = function () {

};

/**
 * Handles click on submit button.
 * @private
 */
SearchFirmForm.prototype._handleFormSubmit = function (event) {
	event.preventDefault();
	event.stopPropagation();
	this.showLoader();
	this.$context.redirect('/firm?what=' + this.getQuery('what') + '&where='  + this.getQuery('where') + '&page=1');
};

/**
 * Gets current specified query.
 * @returns {string}
 */
SearchFirmForm.prototype.getQuery = function (name) {
	return this.$context.element
		.querySelector('input[name=' + name + ']')
		.value;
};

/**
 * Hides loader in template.
 */
SearchFirmForm.prototype.hideLoader = function () {
	var loaders = this.$context.element.getElementsByTagName('cat-loader');
	for(var i = 0; i < loaders.length; i++) {
		loaders[i].style.display = 'none';
	}
};

/**
 * Shows loader in template.
 */
SearchFirmForm.prototype.showLoader = function () {
	var loaders = this.$context.element.getElementsByTagName('cat-loader');
	for(var i = 0; i < loaders.length; i++) {
		loaders[i].style.display = '';
	}
};