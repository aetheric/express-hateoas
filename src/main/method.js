/* global process, console, JSON */
'use strict';

import _ from 'underscore';
import httpConst from 'http-constants';

import Type from './type.js';
import determineType from './_determineType.js';
import checkPermission from './_checkPermission.js';
import doValidation from './_doValidation.js';

export default class Method {

	/**
	 * @param {Resource} resource
	 * @param {String} method
	 */
	constructor(resource, method) {
		this._resource = resource;
		this._method = method;
		this._types = {};

		const path = resource.path;

		try {
			const express = resource.hateoas.express;
			express[method](path, (i,o) => this.handle(i,o));
			console.info(`Handler added for ${path} : ${method}.`);

		} catch (error) {
			console.error(`Failed to add handler for ${method}:${path} - ${error.stack}`);
			process.exit(1);
		}

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

	handle(request, response) {
		return determineType(request, response, this._types).then((typeHandler) => {

			return checkPermission(request, typeHandler, response).then(() => {
				return doValidation(request, typeHandler, response);

			}).then((data) => {
				return typeHandler.handle(request, response, data);

			});

		}).catch((error) => {

			if (error) {
				console.error(error.stack);
				return response.status(httpConst.codes.INTERNAL_SERVER_ERROR).json({
					error: 'An unexpected error occurred.'
				});
			}

		});

	}

	as(type) {
		try {

			const stored = this._types[type];
			if (stored) {
				console.error(`Handler already registered for ${this._resource.path}.${type}:${this._method}.`);
				process.exit(1);
			}

			const newtype = new Type(this, type);
			return this._types[type] = newtype;

		} catch (error) {
			console.error(`hateoas/method: ${error.stack}`);
			process.exit(1);
		}
	}

}
