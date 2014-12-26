Package.describe({
  name: 'aadams:pdftk',
  summary: 'PDFTK wrapper for Meteor',
  version: '0.1.2',
  git: 'https://github.com/aadamsx/meteor-pdftk.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.addFiles('pdftkWrapper.js');
});

Package.onTest(function(api) {
  // api.use('tinytest');
  api.use('aadams:pdftk');
  // api.addFiles('aadams:pdftk-tests.js');
});
