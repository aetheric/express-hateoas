import { registerResolverConfigFactory } from '../scanner.js';
import ResolverConfig from '../ResolverConfig.js';
import ResolverConfigFactory from '../ResolverConfigFactory.js';

const files = require('fs');

export default registerResolverConfigFactory(new ResolverConfigFactory('es6', function(file) {
	return new ResolverConfig('GET', '*/es6', null, function(data, session, resolve, reject) {

		fs.readFile(file, function(error, content) {

			if (error) {
				reject(error);

			} else {
				resolve(content);
			}

		});

	});
}));
