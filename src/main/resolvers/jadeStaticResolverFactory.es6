import { registerResolverConfigFactory } from '../scanner.es6';
import ResolverConfig from '../ResolverConfig.es6';
import ResolverConfigFactory from '../ResolverConfigFactory.es6';

const files = require('fs');

export default registerResolverConfigFactory(new ResolverConfigFactory('jade', function(file) {
	return new ResolverConfig('GET', '*/jade', null, function(data, session, resolve, reject) {

		fs.readFile(file, function(error, content) {

			if (error) {
				reject(error);

			} else {
				resolve(content);
			}

		});

	});
}));
