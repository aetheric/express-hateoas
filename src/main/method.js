/* global */
'use strict';

import Type from './type.js';
import httpConst from 'http-constants';

export default class Method {

	/**
	 * @param {Resource} resource
	 * @param {String} method
	 */
	constructor(resource, method) {
		this._resource = resource;
		this._method = method;
		this._types = {};

		resource.hateoas.express[method](this._resource.path, (request, response) => {

			try {

				const mime = request.headers[httpConst.headers.request.ACCEPT];
				const matches = /[\w\-\*]+?\/([\w\-\*]+?)$/.exec(mime);

				if (!matches || matches.length < 2) {
					console.warn(`No handler found for request.`);
					return response.status(httpConst.codes.UNSUPPORTED_MEDIA_TYPE);
				}

				const mimeMatch = matches[1];
				console.info(`Extracted request type ${mimeMatch} from ${mime}.`);

				const handler = this._types[mimeMatch];

				let data;
				try {
					data = handler.validate(request.data);

				} catch (error) {
					return response.status(httpConst.codes.BAD_REQUEST).json({
						message: error.message
					});
				}

				handler.handle(request, response, data);

			} catch (error) {
				console.error(error.stack);
				return response.status(httpConst.codes.INTERNAL_SERVER_ERROR).json({
					error: 'An unexpected error occurred.'
				});
			}

		});

	}

	get resource() {
		return this._resource;
	}

	get method() {
		return this._method;
	}

	get types() {
		return this._types;
	}

	as(type) {
		return this._types[type]
				|| ( this._types[type] = new Type(this, type) );
	}

}
