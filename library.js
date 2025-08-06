'use strict';

const plugin = {};

plugin.initClient = async function (params) {
  const { router, middleware } = params;

  router.get('/admin/plugins/composer-blocknote', middleware.admin.buildHeader, (req, res) => {
    res.render('admin/plugins/composer-blocknote', {});
  });

  router.get('/api/admin/plugins/composer-blocknote', (req, res) => {
    res.json({ status: 'OK' });
  });
};

plugin.parseBlocknoteContent = async function (data) {
  // For now, return the post content as-is
  return data;
};

plugin.getFormattingOptions = async function (data) {
  data.options = []; // Return an empty array if you're not using any formatting buttons
  return data;
};

module.exports = plugin;
