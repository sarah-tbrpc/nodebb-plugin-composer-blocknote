'use strict';

const plugin = {};

plugin.init = async function (params) {
  // Optional: Add any plugin init logic here
};

plugin.initClient = async function ({ router, middleware }) {
  router.get('/admin/plugins/composer-blocknote', middleware.admin.buildHeader, (req, res) => {
    res.render('admin/plugins/composer-blocknote', {});
  });

  router.get('/api/admin/plugins/composer-blocknote', (req, res) => {
    res.json({ status: 'OK' });
  });
};

plugin.parseBlocknoteContent = async function (data) {
  // Just return content for now
  return data;
};

plugin.getFormattingOptions = async function (data) {
  data.options = []; // Return empty options to disable toolbar
  return data;
};

module.exports = plugin;
