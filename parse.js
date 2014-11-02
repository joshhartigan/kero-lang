function parse(str) {
  return expressionFrom( getTokens(str) );
}

function getTokens(str) {
  return str.replace(/\(/g, ' ( ')
            .replace(/\)/g, ' ) ')
            .trim()
            .split(/\s+/);
}

function expressionFrom(tokens) {

  if (tokens.length === 0) {
    console.log('problem: sudden EOF. qutting...');
    process.exit(1);
  }

  var token = tokens.shift();
  if (token === '(') {
    var list = [];
    while ( tokens[0] !== ')' )
      list.push( expressionFrom(tokens) );
    tokens.shift();
    return list;
  } else {
    if (token === ')') {
      console.log('problem: unmatched ). quitting...');
      process.exit(1);
    } else {
      return atom(token);
    }
  }

}

function atom(token) {
  if ( isNaN(token) ) {
    return token;
  } else {
    return parseFloat(token);
  }
}

module.exports = parse;

