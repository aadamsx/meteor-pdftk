Package.describe({
  name: 'aadams:pdftk',
  summary: 'Wrapper for PDFTK: PDF form fill, concatination, watermark, stamp and more',
  version: '0.3.17',
  git: 'https://github.com/aadamsx/meteor-pdftk.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.3', 'METEOR@1.0']);
  api.export('PDFTK');
  api.addFiles('pdftk-wrapper.js', 'server');
});

Package.onTest(function(api) {
  api.use('aadams:pdftk');
});
