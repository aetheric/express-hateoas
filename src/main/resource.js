/* global */
'use strict';

import Method from './method.js';

export default class Resource {

	constructor(hateoas, path) {
		this.hateoas = hateoas;
		this.path = path;
		this.methods = {};
	}

	on(method) {

		let action = this.methods[method];
		if (!action) {
			action = new Method(this, method);
		}

		return action;
	}

}
