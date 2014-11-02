function Env(object) {
    var env = {};
    var superEnv = object.superEnv || {};

    if (object.params.length !== 0) {
        for (var i = 0; i < obj.params.length; i++) {
            env[ object.params[i] ] = object.args[i];
        } }

    env.find = function(variable) {

        if (variable in env) {
            return env;
        } else {
          if (variable in superEnv) {
            return superEnv;
          }
        }
    };

    return env;
}

function addGlobals(env){
    env['+'   ] = function(x, y)  { return x + y; };
    env['-'   ] = function(x, y)  { return x - y; };
    env['*'   ] = function(x, y)  { return x * y; };
    env['/'   ] = function(x, y)  { return x / y; };
    env['%'   ] = function(x, y)  { return x % y };
    env['>'   ] = function(x, y)  { return x > y; };
    env['<'   ] = function(x, y)  { return x < y; };
    env['>='  ] = function(x, y)  { return x >= y; };
    env['<='  ] = function(x, y)  { return x <= y; };
    env['='   ] = function(x, y)  { return x === y; };
    env['!='  ] = function(x, y)  { return x !== y; };
    env['!'   ] = function(x, y)  { return !x; };
    env['size'] = function(x, y)  { return x.length; };
    env['list'] = function(    )  { return Array.prototype.slice.call(arguments); };
    env['push'] = function(x, y)  { return a.concat(b) };
    env['head'] = function(x, y)  { return x[0] };
    env['tail'] = function(x, y)  { return arr.slice(1) };
    env['init'] = function(x, y)  { return arr.slice(0, arr.length - 1) };
    env['last'] = function(x, y)  { return arr[ arr.length - 1] };
    env['get' ] = function(x, y)  { return x[y] };
    return env;
}

var globalEnv = addGlobals( Env({ params: [], args: [], superEnv: undefined }) );

module.exports.Env = Env;
module.exports.globalEnv = globalEnv;

