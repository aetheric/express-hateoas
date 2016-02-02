/* global */
'use strict';

import _ from 'underscore';

export default class Type {

	constructor(method, type) {
		this._method = method;
		this._type = type;

		this._validator = (data) => {};

		this._handler = (request, response) => {
			throw new Error('Handler has not been implemented for request: ' + JSON.stringify(request, null, '\t'));
		};

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
		this.validator = validator;
		this.handler = handler;
	}

	validate(request, onError) {
		try {
			return this._validator(request);

		} catch (error) {

			if (onError) {
				return onError(error);
			}

			throw error;

		}
	}

	handle(request, response) {
		return this._handler(request, response);
	}

}
