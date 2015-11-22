/* global */
'use strict';

import _ from 'underscore';

export default class Type {

	constructor(method, type) {
		this.method = method;
		this.type = type;

		this._validator = (data) => {};

		this._handler = (request, response) => {
			throw new Error('Handler has not been implemented for request: ' + JSON.stringify(request, null, '\t'));
		};

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

	validate(request) {

		const data = _.extend({}, request.query, request.body, request.params);

		try {
			this._validator(data);

		} catch (error) {
			return error;
		}
	}

	handle(request, response) {
		return this._handler(request, response);
	}

}
