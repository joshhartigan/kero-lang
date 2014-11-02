var evaluate = require('./evaluate');
var fs = require('fs');
var parse = require('./parse');

if (!process.argv) {
  console.log('problem: you must specify a filename. quitting...');
  process.exit(1);
}

fs.readFile( process.argv[2], 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  console.log( evaluate( parse( data.split('\n').join(' ') ) ) );
});

