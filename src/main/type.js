/* global JSON */
'use strict';

import _ from 'underscore';

export default class Type {

	constructor(method, type) {
		this._method = method;
		this._type = type;
	}

	get method() {
		return this._method;
	}

	get type() {
		return this._type;
	}

	set validator(validator) {

		if (this._validator) {
			throw new Error('Validator has already been set.');
		}

		this._validator = validator;

	}

	set handler(handler) {

		if (this._handler) {
			throw new Error('Handler has already been set.');
		}

		this._handler = handler;

	}

	init(validator, handler) {

		if (this._validator || this._handler) {
			throw new Error('One or more of validator or handler has already been set.');
		}

		this._validator = validator;
		this._handler = handler;

	}

	validate(request, onError) {

		const validator = this._validator || ((data) => {
			console.info(`Not validating ${this._type} on ${this._resource.path}.`)
		});

		try {
			return validator(request);

		} catch (error) {

			if (onError) {
				return onError(error);
			}

			throw error;

		}
	}

	handle(request, response) {

		const handler = this._handler || ((request, response) => {
			throw new Error('Handler has not been implemented for request: ' + JSON.stringify(request, null, '\t'));
		});

		return handler(request, response);

	}

}
