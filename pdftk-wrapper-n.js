var exec = Npm.require('child_process').exec;
var fs = Npm.require('fs');

if (PDFTK === undefined)
  PDFTK = {};

/**
 * Execute the PDFTK installed in the system
 * @param  {Array}    args - command-line arguments to pdftk
 * @param  {Function} callback - callback function that receives error, stdout, and stderr
 */
PDFTK.executeN = function (args, callback) {
  var command = 'pdftk ' + args.join(' ');
  exec(command, {encoding: 'binary', maxBuffer: 1024 * 1000}, function(err, stdout, stderr) {
    if(err) return callback(new Error(err));
    callback(null, new Buffer(stdout, 'binary'));
  });
};


// todo: add page ranges and file handles
/*
 * Assemble pages from the input PDF(s) to create a new PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-cat
 * @param {first: pdf1, second: pdf2, third: pdf3, forth: pdf4, fifth: pdf5}     pdf# - Path to input PDF file
 * @param {String}      output
 * @param {Function}    callback
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
// to be used OUTSIDE of Meteor methods
PDFTK.catN = function(inputs, output, callback) {
  var params = _.defaults(inputs,
    {first: 'undefined', second: 'undefined', third: 'undefined', forth: 'undefined', fifth: 'undefined'}
  );

  if (params.first === 'undefined'|| params.second === 'undefined') throw 'invalid parameters';
  else if (params.third !== 'undefined' && (params.forth === 'undefined' || params.fifth === 'undefined'))
    PDFTK.executeN([params.first, params.second, params.third, 'cat', 'output', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth === 'undefined')
    PDFTK.executeN([params.first, params.second, params.third, params.forth, 'cat', 'output', output], callback);
  else if (params.third !== 'undefined' && params.forth !== 'undefined' && params.fifth !== 'undefined')
    PDFTK.executeN([params.first, params.second, params.third, params.forth, params.fifth, 'cat', 'output', output], callback);
  else PDFTK.executeN([params.first, params.second, 'cat', 'output', output], callback);
};


/**
 * Fills the single input PDF's form fields with the data from an FDF or XFDF file. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-fill-form
 * @param {String}      pdf - path to the input PDF file
 * @param {String}      xfdf - path to the (X)FDF file
 * @param {String}      output - path to the output PDF file
 * @param {Function}    callback
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
// to be used OUTSIDE of Meteor methods
PDFTK.fillformN = function(pdf, xfdf, output, callback) {
  PDFTK.executeN([pdf, 'fill_form', xfdf, 'output', output, 'flatten'], callback);
};
