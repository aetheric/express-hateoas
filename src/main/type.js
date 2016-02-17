/* global JSON */
'use strict';

import suit from 'suit';

const constraints = suit.constraints();

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
			console.error('You shouldn\'t try to set this more than once.');
			throw new Error('Validator has already been set.');
		}

		this._validator = validator;

	}

	set handler(handler) {

		if (this._handler) {
			console.error('You shouldn\'t try to set this more than once.');
			throw new Error('Handler has already been set.');
		}

		this._handler = handler;

	}

	init(validator, handler) {

		if (this._validator || this._handler) {
			console.error('You shouldn\'t try to set this more than once.');
			throw new Error('One or more of validator or handler has already been set.');
		}

		this._validator = validator;
		this._handler = handler;

	}

	validate(data, onError) {

		const validator = this._validator || ((data) => {
			console.info(`Not validating ${this._type} on ${this._method.resource.path}.`);
		});

		try {
			return suit.fit(data, validator(constraints));

		} catch (error) {

			if (onError) {
				return onError(error);
			}

			throw error;

		}
	}

	handle(request, response, data) {

		const handler = this._handler;

		if (!handler) {
			console.error('Handler not implemented!');
			throw new Error('Request cannot be procesed. Handler not implemented.');
		}

		return handler(request, response, data);

	}

}
