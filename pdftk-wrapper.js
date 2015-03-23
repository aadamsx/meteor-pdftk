var fs = Npm.require('fs');

if (PDFTK === undefined)
  PDFTK = {};

/*
 * Execute the PDFTK installed in the system
 * @param  {Array}    args - command-line arguments to pdftk
 */
PDFTK.execute = Meteor.wrapAsync(function execute(args, callback) {
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
/*
 * Assemble pages from the input PDF(s) to create a new PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-cat
 * @param {first: pdf1, second: pdf2, third: pdf3, forth: pdf4, fifth: pdf5}     pdf# - Path to input PDF file
 * @param {String}      output
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
PDFTK.cat = function(inputs, output) {
  /** this method calls out synchronous, by omitting the callback to the wrap async function PDFTK.execute */

  var params = _.defaults(inputs,
    {first: 'undefined', second: 'undefined', third: 'undefined', forth: 'undefined', fifth: 'undefined', sixth: 'undefined', seventh: 'undefined', eighth: 'undefined'}
  );

  // console.log(params);

  if (params.first === 'undefined'|| params.second === 'undefined') new Error('invalid parameters');
  else if (params.eighth !== 'undefined') {
    PDFTK.execute([params.first, params.second, params.third, params.forth, params.fifth, params.sixth, params.seventh, params.eighth, 'cat', 'output', output]);
  }
  else if (params.seventh !== 'undefined') {
    PDFTK.execute([params.first, params.second, params.third, params.forth, params.fifth, params.sixth, params.seventh, 'cat', 'output', output]);
  }
  else if (params.sixth !== 'undefined') {
    PDFTK.execute([params.first, params.second, params.third, params.forth, params.fifth, params.sixth, 'cat', 'output', output]);
  }
  else if (params.fifth !== 'undefined') {
    PDFTK.execute([params.first, params.second, params.third, params.forth, params.fifth, 'cat', 'output', output]);
  }
  else if (params.forth !== 'undefined') {
    PDFTK.execute([params.first, params.second, params.third, params.forth, 'cat', 'output', output]);
  }
  else if (params.third !== 'undefined') {
    PDFTK.execute([params.first, params.second, params.third, 'cat', 'output', output]);
  }
  else {
    PDFTK.execute([params.first, params.second, 'cat', 'output', output]);
  }
};


/**
 * Assemble page range from the input PDF to create a new PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-cat
 * @param {String}      pdf - Path to input PDF file
 * @param {String}      start
 * @param {String}      end
 * @param {String}      output
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
PDFTK.pages = function(pdf, start, end, output) {
  var range = (start || 1) + '-' + (end || 'end');
  PDFTK.execute([pdf, 'cat', range, 'output', output]);
};

/**
 * Fills the single input PDF's form fields with the data from an FDF or XFDF file. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-fill-form
 * @param {String}      pdf - path to the input PDF file
 * @param {String}      xfdf - path to the (X)FDF file
 * @param {String}      output - path to the output PDF file
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
// without Promises, and to be used INSIDE of Meteor methods
PDFTK.fillform = function(pdf, xfdf, output) {
  /** this method calls out synchronous, by omitting the callback to the wrap async function PDFTK.execute */
  PDFTK.execute([pdf, 'fill_form', xfdf, 'output', output, 'flatten']);
};

/**
 * Stamp the input PDF with the `stamp` file and produce an `output` PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-stamp
 * @param {String}      pdf - path to the input PDF file
 * @param {String}      stamp - path to the stamp PDF file
 * @param {String}      output - path to the output PDF file
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
PDFTK.stamp = function(pdf, stamp, output) {
  PDFTK.execute([pdf, 'stamp', stamp, 'output', output]);
};

/**
 * Stamp the input PDF with each page of the `stamp` file and produce an `output` PDF. Read more at https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-multistamp
 * @param {String}      pdf - path to the input PDF file
 * @param {String}      stamp - path to the stamp PDF file
 * @param {String}      output - path to the output PDF file
 * @return {Npm.buffer} Node.js Buffer with the result of executing the pdftk command
 */
PDFTK.multistamp = function multistamp(pdf, stamp, output) {
  return PDFTK.execute([pdf, 'multistamp', stamp, 'output', output]);
};
