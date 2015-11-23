/* global */
'use strict';

import Method from './method.js';
import * as verbs from './ref/methods.js'

function ensure(resource, verb) {
	return resource.methods[verb]
			|| ( resource.methods[verb] = new Method(resource.methods, verb) );
}

export default class Resource {

	constructor(hateoas, path) {
		this.hateoas = hateoas;
		this._path = path;
		this.methods = {};
	}

	get path() {
		return this._path;
	}

	OPTIONS() {
		return ensure(this, verbs.OPTIONS);
	}

	GET() {
		return ensure(this, verbs.GET);
	}

	HEAD() {
		return ensure(this, verbs.HEAD);
	}

	POST() {
		return ensure(this, verbs.POST);
	}

	PUT() {
		return ensure(this, verbs.PUT);
	}

	DELETE() {
		return ensure(this, verbs.DELETE);
	}

	TRACE() {
		return ensure(this, verbs.TRACE);
	}

	CONNECT() {
		return ensure(this, verbs.CONNECT);
	}

}
