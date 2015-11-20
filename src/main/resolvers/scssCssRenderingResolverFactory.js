import { registerResolverConfigFactory } from '../scanner.js';
import ResolverConfig from '../ResolverConfig.js';
import ResolverConfigFactory from '../ResolverConfigFactory.js';

let _ = require('underscore');
let sass = require('node-sass');

export default registerResolverConfigFactory(new ResolverConfigFactory('css', function(file) {
	return new ResolverConfig('GET', '*/css', null, function(data, session, resolve, reject) {

		let scope = _.extend({}, session, data, {
			file: file
		});

		sass.render(scope, function(error, css) {

			if (error) {
				reject(error);

			} else {
				resolve(css);
			}

		});

	});
}));
