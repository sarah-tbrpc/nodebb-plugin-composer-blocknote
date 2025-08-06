'use strict';

const path = require('path');

const plugin = {};

plugin.initClient = async function (params) {
  const { router, middleware, helpers } = params;

  // Optional: add a custom route to test if your plugin is working
  router.get('/admin/plugins/composer-blocknote', middleware.admin.buildHeader, (req, res) => {
    res.render('admin/plugins/composer-blocknote', {});
  });
  router.get('/api/admin/plugins/composer-blocknote', (req, res) => {
    res.json({ status: 'OK' });
  });
};

plugin.parseBlocknoteContent = async function (data) {
  // This is where you could sanitize or convert BlockNote content
  // For now, just return data as-is (no-op)
  return data;
};

module.exports = plugin;
