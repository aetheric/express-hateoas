/* global JSON, console */
'use strict';

import _ from 'underscore';
import suit from 'suit';
import httpConst from 'http-constants';

const constraints = suit.constraints([
	'basic-types',
	'basic-ui'
]);

export default class Type {

	constructor(method, type) {
		this._method = method;
		this._type = type;
	}

	/**
	 * @returns {Method}
	 */
	get method() {
		return this._method;
	}

	/**
	 * @returns {String}
	 */
	get type() {
		return this._type;
	}

	/**
	 * @param {String} permission
	 */
	set permission(permission) {
		this._permission = permission;
	}

	/**
	 * @callback Validator
	 * @param {Object} constraints Constrainst object from the 'suit' validation library.
	 * @returns {Object} suit schema
	 */
	/**
	 * @param {Validator} validator
	 */
	set validator(validator) {

		if (this._validator) {
			console.error('You shouldn\'t try to set this more than once.');
			throw new Error('Validator has already been set.');
		}

		this._validator = validator;

	}

	/**
	 * @callback Handler
	 * @param {*} request
	 * @param {*} response
	 * @param {Object} params
	 * @returns {Promise}
	 */
	/**
	 * @param {Handler} handler
	 */
	set handler(handler) {

		if (this._handler) {
			console.error('You shouldn\'t try to set this more than once.');
			throw new Error('Handler has already been set.');
		}

		this._handler = handler;

	}

	/**
	 * @param {Object} data
	 * @returns {Object}
	 * @throws {Array} When a validation error occurs
	 */
	validate(data) {

		const validator = this._validator || (() => {
			console.info(`Not validating ${this._type} on ${this._method.resource.path}.`);
		});

		try {
			return suit.fit(data, validator(constraints));

		} catch (error) {

			if (_.isString(error)) {
				throw JSON.parse(error);
			}

			throw error;

		}
	}

	/**
	 * @param request
	 * @param response
	 * @param data
	 * @returns {Promise}
	 */
	handle(request, response, data) {

		const handler = this._handler;

		if (!handler) {
			return response.status(httpConst.codes.NOT_FOUND).json({});
		}

		return handler(request, response, data);

	}

}
