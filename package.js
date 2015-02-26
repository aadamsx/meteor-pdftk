Package.describe({
  name: 'aadams:pdftk',
  summary: 'Wrapper for PDFTK: PDF form fill, real concatination, file merge, split, encrypt, decrypt, rotate, watermark, stamp and more',
  version: '0.1.12',
  git: 'https://github.com/aadamsx/meteor-pdftk.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.3', 'METEOR@1.0']);
  api.use(['underscore'], 'server');
  api.export('PDFTK');
  api.addFiles('pdftk-wrapper.js', 'server');
});

Package.onTest(function(api) {
  api.use('aadams:pdftk');
});
