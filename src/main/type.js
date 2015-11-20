/* global */
'use strict';

export default class Type {

	constructor(method, type) {
		this.method = method;
		this.type = type;
		this._validator = (data) => true;
		this._handler = (request, response) => {};
	}

	/**
	 * @returns {Function<Boolean>}
	 */
	get validator() {
		return this._validator;
	}

	/**
	 * @param {Function<Boolean>} validator
	 */
	set validator(validator) {
		this._validator = validator;
	}

	/**
	 * @returns {Function}
	 */
	get handler() {
		return this._handler;
	}

	/**
	 * @param {Function} handler
	 */
	set handler(handler) {
		this._handler = handler;
	}

}
