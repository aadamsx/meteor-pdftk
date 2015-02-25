Package.describe({
  name: 'aadams:pdftk',
  summary: 'PDFTK wrapper for Meteor',
  version: '0.1.8',
  git: 'https://github.com/aadamsx/meteor-pdftk.git'
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.3', 'METEOR@1.0']);
  api.use(['underscore'], 'server');
  api.export('PDFTK');
  api.addFiles('pdftkWrapper.js', 'server');
});

Package.onTest(function(api) {
  // api.use('tinytest');
  api.use('aadams:pdftk');
  // api.addFiles('aadams:pdftk-tests.js');
});
