'use strict';

import serverConfig from 'eslint-config-nodebb';
import publicConfig from 'eslint-config-nodebb/public';

export default [
	{
		ignores: ['static/dist/**', 'node_modules/**', '*.bundle.js', '*.min.js', 'static/composer.js'],
	},
	...publicConfig,
	...serverConfig,
];

