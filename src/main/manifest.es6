/* globals require */

import * as scanner from './scanner.es6';

let _ = require('underscore');

export let manifest = {};

/**
 *
 * @param {Array|String} path The path to store the config under; if a string, will be converted to an array.
 * @param {Object} config The endpoint configuration to store.
 */
export function store(path, config) {

	if (_.isString(path)) {
		console.log(`Splitting ${path} into array...`);
		let pathArray = path.split('/');
		return store(pathArray, config);
	}

	if (!_.isArray(path)) {
		console.error(`Expected Array object, got ${typeof(path)}: ${JSON.stringify(path)}`);
		return;
	}

	let pathArray = path.slice();
	let methodTarget = '$' + ( config.method || pathArray[pathArray.length - 2] );
	pathArray.push(methodTarget, config.mime || pathArray[pathArray.length - 1] );

	return search(manifest, path, config);

}

/**
 *
 * @param {String} basePath
 */
export function init(basePath) {

	scanner.scan(basePath, function(filePath, config) {
		let path = filePath.substring(basePath.length);
		console.log(`Trimming ${filePath} down to ${path} before storage.`);
		store(path, config);
	});

}

/**
 * Finds a particular method config by search path, http method, and mime type.
 * @param {Array|String} path
 * @param {String} method
 * @param {String} mime
 * @returns {Object}
 */
export function find(path, method, mime) {

	if (_.isString(path)) {
		let pathArray = path.split('/');
		return find(pathArray, method, mime);
	}

	let pathArray = path.filter(function(element) {
		return !!element;
	});

	let methodTarget = '$' + method.toUpperCase();
	pathArray.push(methodTarget, mime);

	return search(manifest, pathArray, false);

}

/**
 *
 * @param {Object} parent
 * @param {Array} path
 * @param {Object} [create]
 */
export function search(parent, path, create) {

	console.log(`Searching for ${JSON.stringify(path)} in ${JSON.stringify(parent)}`);

	// If there are no more path elements left...
	if (!path.length) {
		console.log('Found what we\'re looking for!');
		return parent;
	}

	// Find the next child on the path stack.
	let targetName = _.first(path);
	let targetChild = parent[targetName];

	// If the target exists...
	if (targetChild) {
		// Recurse down another level with the rest of the stack.
		return search(targetChild, _.rest(path), create);
	}

	// If it doesn't exist, and you're only looking...
	if (!create) {
		console.log('Didn\'t find anything!');
		return null;
	}

	// Otherwise, create a new child
	let newChild = parent[targetName] = create;

	// Then recurse down into it with the rest of the path stack.
	return search(newChild, _.rest(path), create);

}

export default {
	init: init,
	find: find
};
