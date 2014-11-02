var globalEnv = require('./environment').globalEnv;
var Env = require('./environment').Env;

function evaluate(expr, env) {

  env = env || globalEnv;

  if (typeof expr === 'string') {
    return env.find( expr.valueOf() )[ expr.valueOf() ];
  }

  else if (typeof expr === 'number') {
    return expr;
  }

  else if (expr[0] === '_') {
    return expr[1];
  }

  else if (expr[0] === 'if') {
    var condition  = expr[1];
    var consequent = expr[2];
    var alternate  = expr[3];
    if ( evaluate(condition, env) ) {
      return evaluate(consequent, env);
    } else {
      return evaluate(alternate, env);
    }
  }

  else if (expr[0] === 'def') {
    env[ expr[1] ] = evaluate( expr[2], env );
  }

  else if (expr[0] === 'fn') {
    var _params = expr[1];
    var body    = expr[2];
    return function() {
      return evaluate( exp, Env({ params: _params, args: arguments, superEnv: env }) );
    };
  }

  else if (expr[0] === 'seq') {
    var val;

    for (var i = 1; i < expr.length; i++) {
      val = evaluate( expr[i], env );
    }

    return val;
  }

  else {
    var exps = [];

    for (i = 0; i < expr.length; i++) {
      exps[i] = evaluate( expr[i], env );
    }

    var proc = exps.shift();
    return proc.apply(env, exps);
  }
}

module.exports = evaluate;

