fs = require('fs')


# -*- FILE I/O MANAGEMENT -*- #
if not process.argv[2]
  return console.log 'problem: you must specify a filename.'

fs.readFile process.argv[2], 'utf8', (err, data) ->
  return console.log err if err
  console.log parse data.split('\n').join(' ')


# -*- PARSING -*- #
trim = (string) ->
  string.replace( /^\s+|\s+$/g, '' )

parse = (text) ->
  text = trim text

  if text.charAt 0 != '('
    return text

  stack = []
  token = ''
  tokens = ''
  comment = false
  i = 0
  expr = []

  while i < text.length
    token = text.charAt i++

    if (token is '(' or token is ')') or (token is ' ' and not comment)
      if expr and tokens.length
        n = +tokens
        expr.push isNaN n ? tokens : n
      tokens = ''

    else
      comment = not comment if token is '\''
      if not /\s/.test token or comment
        tokens += token

    if token is '('
      previous = expr
      expr = []

      if previous
        stack.push previous
        previous.push expr

    else if token is ')'
      pop = stack.pop
      if not pop
        return expr
      expr = pop

  console.log 'problem: unclosed parentheses.'


# -*- EVALUATION -*- #

evaluate = (expr, env) ->
  if typeof expr is 'string' and expr.charAt 0 is '('
    expr = parse expr
  else if typeof expr is 'number'
    return expr
  else if not expr instanceof Array
    expr = [expr]

  if not env
    env = Object.create atoms

  args = []
  for i in [0 .. expr.length]
    if expr[i] in env
      args.push env[ expr[i] ]
    else
      args.push expr[i]

  fn = args[0]
  args = args.slice 1

  if fn in functions
    return procedures[fn](args, env)
  else
    return fn

atoms =
  'nil': false,
  'true': true

functions =
  'fn': (args) ->
    fn = args[0]
    params = args[1]
    body = args.slice 2

    functions[fn] = (_args, env) ->
      _env = Object.create env
      output = false
      for i in [0 .. params.length]
        _env[ params[i] ] = evaluate _args[i], _env
      for i in [0 .. body.length]
        output = evaluate body[j], _env
      output
    fn

  'if': (args, env) ->
    condition = evaluate args[0], env
    if condition
      output = evaluate args[1], env
    else if args[2]
      output = evaluate args[2], env
    output

  'def': (args, env) ->
    env[ evaluate args[0][0][0], env ] = evaluate args[0][0][1], env
    evaluate args[1], env

  '+': (args, env) ->
    output = 0
    for i in [1 .. args.length]
      output += evaluate args[i], env
    output

  '-': (args, env) ->
    output = evaluate args[0], env
    for i in [1 .. args.length]
      output -= evaluate args[i], env
    output

  '*': (args, env) ->
    output = 1
    for i in [1 .. args.length]
      output *= evaluate args[i], env
    output

  '/': (args, env) ->
    output = evaluate args[0], env
    for i in [1 .. args.length]
      res /= evaluate args[i], env
    res

  '#': (args, env) ->
    for i in [0 .. args.length]
      args[i] = evaluate args[i], env
    args

  'seq': (args, env) ->
    res = this['#'] args, env
    if res.length
      res[res.length - 1]
    else false

  'puts': (args, env) ->
    res = this['seq'] args, env
    process.stdout.write res
    res

