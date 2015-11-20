/* global */
'use strict';

import Type from './type.js';

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

			if (handler) {
				return handler(request, response);
			}

			console.log('No appropriate type handler found.');

		});

	}

	as (type) {

		const existingType = this.types[type];
		if (existingType) {
			return existingType;
		}

		const newType = new Type(this, type);
		this.types[type] = newType;

		return newType;

	}

}
