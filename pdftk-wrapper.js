var exec = Npm.require('child_process').exec;
var fs = Npm.require('fs');
var execFile = Npm.require('child_process').execFile;
// var Q = require("../q");

if (PDFTK === undefined)
  PDFTK = {};

/**
 * Execute the PDFTK installed in the system
 * @param  {Array}    args - command-line arguments to pdftk
 * @param  {Function} callback - callback function that receives error, stdout, and stderr
 */
PDFTK.execute = function (args, callback) {
  var command = 'pdftk ' + args.join(' ');
  exec(command, {encoding: 'binary', maxBuffer: 1024 * 1000}, function(err, stdout, stderr) {
    if(err) return callback(new Error(err));
    callback(null, new Buffer(stdout, 'binary'));
  });
};

/**
 * Execute the PDFTK installed in the system, customized
 * @param  {Array}    args - command-line arguments to pdftk
 * @param  {Function} callback - callback function that receives error, stdout, and stderr
 */
PDFTK.executeQ = function (args, callback) {
  var command = 'pdftk ' + args.join(' ');
  exec(command, {encoding: 'binary', maxBuffer: 1024 * 1000}, function(err, stdout, stderr) {
    if(err) return callback(new Error(err));
    callback();
  });
};

/**
 * Execute the PDFTK installed in the system
 * @param  {Array}    args - command-line arguments to pdftk
 * @param  {Function} callback - callback function that receives error, stdout, and stderr
 */
PDFTK.executeM = Meteor.wrapAsync(function execute(args, callback) {
  execFile('pdftk', args, {encoding: 'binary', maxBuffer: 1024 * 1000}, function pdftkCallback(error, stdout, stderr) {
    if (error) {
      if (error.code === "ENOENT")
        callback('Could not find pdftk executable');
      else
        callback(error);
    } else {
      callback(null, new Buffer(stdout, 'binary'), new Buffer(stderr, 'binary'));
    }
  });
});

// todo: add page ranges and file handles
/**
 * Assemble pages from the input PDF(s) to create a new PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-cat
 * @param {first: pdf1, second: pdf2, third: pdf3, forth: pdf4, fifth: pdf5}     pdf# - Path to input PDF file
 * @param {String}      output
 * @param {Function}    callback
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
 // with Promises, and to be used OUTSIDE of Meteor methods
PDFTK.catQ = function(inputs, output, callback) {
  var deferred = Q.defer();
  var params = _.defaults(inputs,
    {first: 'undefined', second: 'undefined', third: 'undefined', forth: 'undefined', fifth: 'undefined'}
  );

  if (params.first === 'undefined'|| params.second === 'undefined') new Error('invalid parameters');
  else if (params.third !== 'undefined' && (params.forth === 'undefined' || params.fifth === 'undefined')) {
    PDFTK.executeQ([params.first, params.second, params.third, 'cat', 'output', output], function (error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });
  }
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth === 'undefined') {
    PDFTK.executeQ([params.first, params.second, params.third, params.forth, 'cat', 'output', output], function (error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });
  }
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth !== 'undefined') {
    PDFTK.executeQ([params.first, params.second, params.third, params.forth, params.fifth, 'cat', 'output', output], function (error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });
  }
  else {
    PDFTK.executeQ([params.first, params.second, 'cat', 'output', output], function (error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });
  }
  return deferred.promise.nodeify(callback);
};
// without Promises, and to be used OUTSIDE of Meteor methods
PDFTK.cat = function(inputs, output, callback) {
  var params = _.defaults(inputs,
    {first: 'undefined', second: 'undefined', third: 'undefined', forth: 'undefined', fifth: 'undefined'}
  );

  if (params.first === 'undefined'|| params.second === 'undefined') throw 'invalid parameters';
  else if (params.third !== 'undefined' && (params.forth === 'undefined' || params.fifth === 'undefined'))
    PDFTK.execute([params.first, params.second, params.third, 'cat', 'output', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth === 'undefined')
    PDFTK.execute([params.first, params.second, params.third, params.forth, 'cat', 'output', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth !== 'undefined')
    PDFTK.execute([params.first, params.second, params.third, params.forth, params.fifth, 'cat', 'output', output], callback);
  else PDFTK.execute([params.first, params.second, 'cat', 'output', output], callback);
};
// without Promises, and to be used INSIDE of Meteor methods
PDFTK.catM = function(inputs, output, callback) {
  var params = _.defaults(inputs,
    {first: 'undefined', second: 'undefined', third: 'undefined', forth: 'undefined', fifth: 'undefined'}
  );

  if (params.first === 'undefined'|| params.second === 'undefined') throw 'invalid parameters';
  else if (params.third !== 'undefined' && (params.forth === 'undefined' || params.fifth === 'undefined'))
    PDFTK.executeM([params.first, params.second, params.third, 'cat', 'output', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth === 'undefined')
    PDFTK.executeM([params.first, params.second, params.third, params.forth, 'cat', 'output', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth !== 'undefined')
    PDFTK.executeM([params.first, params.second, params.third, params.forth, params.fifth, 'cat', 'output', output], callback);
  else PDFTK.executeM([params.first, params.second, 'cat', 'output', output], callback);
};


/**
 * Assemble page range from the input PDF to create a new PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-cat
 * @param {String}      pdf - Path to input PDF file
 * @param {String}      start
 * @param {String}      end
 * @param {String}      output
 * @param {Function}    callback
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
PDFTK.pages = function(pdf, start, end, output, callback) {
  var range = (start || 1) + '-' + (end || 'end');
  PDFTK.execute([pdf, 'cat', range, 'output', output], callback);
};

/**
 * Fills the single input PDF's form fields with the data from an FDF or XFDF file. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-fill-form
 * @param {String}      pdf - path to the input PDF file
 * @param {String}      xfdf - path to the (X)FDF file
 * @param {String}      output - path to the output PDF file
 * @param {Function}    callback
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
// with Promises, and to be used OUTSIDE of Meteor methods
PDFTK.fillformQ = function(pdf, xfdf, output, callback) {
 var deferred = Q.defer();
 PDFTK.executeQ([pdf, 'fill_form', xfdf, 'output', output, 'flatten'], function (error) {
   if (error) deferred.reject(error);
   else deferred.resolve();
 });
 return deferred.promise.nodeify(callback);
};
// without Promises, and to be used OUTSIDE of Meteor methods
PDFTK.fillform = function(pdf, xfdf, output, callback) {
  PDFTK.execute([pdf, 'fill_form', xfdf, 'output', output, 'flatten'], callback);
};
// without Promises, and to be used INSIDE of Meteor methods
PDFTK.fillformM = function(pdf, xfdf, output, callback) {
  PDFTK.executeM([pdf, 'fill_form', xfdf, 'output', output, 'flatten'], callback);
};


/**
 * Stamp the input PDF with the `stamp` file and produce an `output` PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-stamp
 * @param {String}      pdf - path to the input PDF file
 * @param {String}      stamp - path to the stamp PDF file
 * @param {String}      output - path to the output PDF file
 * @param {Function}    callback
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
PDFTK.stamp = function(pdf, stamp, output, callback) {
  PDFTK.execute([pdf, 'stamp', stamp, 'output', output], callback);
};

/**
 * Stamp the input PDF with each page of the `stamp` file and produce an `output` PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-multistamp
 * @param {String}      pdf - path to the input PDF file
 * @param {String}      stamp - path to the stamp PDF file
 * @param {String}      output - path to the output PDF file
 * @param {Function}    callback
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
PDFTK.multistamp = function multistamp(pdf, stamp, output, callback) {
  return PDFTK.execute([pdf, 'multistamp', stamp, 'output', output], callback);
};
