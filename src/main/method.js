/* global */
'use strict';

import Type from './type.js';
import * as codes from './ref/codes.js';

/**
 * @param {String} path
 * @returns {String}
 */
export function extractTypeFromPath(path) {
	const matches = /.*\.(\w+)$/.exec(path);
	return matches && matches.length > 1
			? matches[1]
			: undefined;
}

export function extractTypeFromMime(mime) {
	const matches = /\w+\/(\w+)$/.exec(mime);
	return matches && matches.length > 1
			? matches[1]
			: undefined;
}

export default class Method {

	/**
	 * @param {Resource} resource
	 * @param {String} method
	 */
	constructor(resource, method) {
		this.resource = resource;
		this.method = method;
		this.types = {};

		const getHandler = (request) => {

			const pathMatch = extractTypeFromPath(request.pathname);
			if (pathMatch) {
				return this.types[pathMatch];
			}

			const mime = request.header('ContentType');
			const mimeMatch = extractTypeFromMime(mime);
			if (mimeMatch) {
				return this.types[mimeMatch];
			}

			return undefined;

		};

		resource.express[method]((request, response) => {

			const handler = getHandler(request);

			if (!handler) {
				response.status(codes.UNSUPPORTED_MEDIA_TYPE);
				return;
			}

			const errors = handler.validate(request.data);

			if (!errors) {
				return handler.handle(request, response);
			}

			response.status(codes.BAD_REQUEST)
					.body(errors);

		});

	}

	as (type) {
		return this.types[type]
				|| ( this.types[type] = new Type(this, type) );
	}

}
