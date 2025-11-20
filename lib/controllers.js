'use strict';

const Controllers = module.exports;

Controllers.renderAdmin = function (req, res) {
	res.render('admin/plugins/composer-blocknote', {
		title: 'BlockNote Composer Settings',
	});
};
