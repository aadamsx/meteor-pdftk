var exec = Npm.require('child_process').exec;
var fs = Npm.require('fs');

if (PDFTK === undefined)
  PDFTK = {};

/**
 * Execute PTFTK in command line
 * @param  {array}    args: pdftk args
 * @param  {Function} callback: ...hum... the callback!
 */
PDFTK.execute = function (args, callback) {
  var command = 'pdftk ' + args.join(' ');
  console.log(command);
  exec(command, {encoding: 'binary', maxBuffer: 1024 * 1000}, function(err, stdout, stderr) {
    if(err) return callback(new Error(err));
    callback(null, new Buffer(stdout, 'binary'));
  });
};

/**
 * Methodes return a Buffer with result PDFTK command
 */

PDFTK.pages = function(pdf, start, end, callback) {
  var range = (start || 1) + '-' + (end || 'end');
  PDFTK.execute([pdf, 'cat', range, 'output -'], callback);
};

PDFTK.fillForm = function(pdf, xfdf, output, callback) {
  PDFTK.execute([pdf, 'fill_form ', xfdf, 'output ', output], callback);
};

// need to add optional inputs to this method
PDFTK.cat = function(in1, in2, output, callback) {
  PDFTK.execute([in1, in2, 'cat ', 'output ', output], callback);
};

PDFTK.cat = function(inputs, output, callback) {
  var params = _.defaults(inputs,
    {first: 'undefined', second: 'undefined', third: 'undefined', forth: 'undefined', fifth: 'undefined'}
  );

  if (params.first === 'undefined'|| params.second === 'undefined') throw 'invalid parameters';
  else if (params.third !== 'undefined' && (params.forth === 'undefined' || params.fifth === 'undefined'))
    PDFTK.execute([params.first, params.second, params.third, 'cat ', 'output ', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth === 'undefined')
    PDFTK.execute([params.first, params.second, params.third, params.forth, 'cat ', 'output ', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth !=== 'undefined')
    PDFTK.execute([params.first, params.second, params.third, params.forth, params.fifth, 'cat ', 'output ', output], callback);
  else PDFTK.execute([params.first, params.second, 'cat ', 'output ', output], callback);
};

/**
 * Stamp
 * Ex: pdftk sample.pdf stamp stamp.pdf output -
 */
PDFTK.stamp = function(pdf, stamp, output, callback) {
  PDFTK.execute([pdf, 'stamp', stamp, 'output', output], callback);
};
