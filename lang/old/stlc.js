(function() {
  'use strict';

var _ = require('underscore');

function FreeVars(x) {
  this.store = {};
  if(x) {
    if(x instanceof FreeVars) {
      _(this.store).extend(x.store);
    } else if(x instanceof Variable) {
      this.store[x.id] = x;
    } else {
      throw 'Bad Constructor: FreeVars(' + x + ')';
    }
  }
}

FreeVars.prototype.bind = function(x) {
  this.store[x.id] = x;
};

FreeVars.prototype.has = function(x) {
  return _(this.store).has(x.id);
};

FreeVars.prototype.toString = function() {
  return '[' + _(this.store).map(function(value, key) {
    return value.toString();
  }).join(', ') + ']';
};

function concatFreeVar(x, vars) {
  var tmp = new FreeVars(x);
  _(tmp.store).extend(vars.store);
  return tmp;
}

function concatFreeVars(lhs, rhs) {
  var tmp = new FreeVars(lhs);
  _(tmp.store).extend(rhs.store);
  return tmp;
}

function freeVars(term) {
  var fvs = new FreeVars();
  return term.freeVars(fvs);
}

//////////////////////////////////////////////////////////////

function Constant(name, value) {
  this.name = name;
  this.value = value;
}

Constant.prototype.freeVars = function(freevars) { 
  return new FreeVars(); 
};

Constant.prototype.toString = function() {
  return this.value;
};

function Variable(id) {
  this.id = id;
}

Variable.prototype.freeVars = function(freevars) {
  if(freevars.has(this)) {
    return new FreeVars();
  } else {
    return concatFreeVar(this, freevars);
  }
};

Variable.prototype.toString = function() {
  return this.id;
};

function TermBinding(variable, type) {
  this.variable = variable;
  this.type = type;
}

function Store(target, source) {
  this.target = target;
  this.source = source;
}

Store.prototype.freeVars = function(freevars) {
};

Store.prototype.toString = function() {
  return this.target.toString() + '=' + this.source.toString();
};

function Return(expr) {
  this.expr = expr;
}

Return.prototype.freevars = function(freevars) {
};

Return.prototype.toString = function() {
  return 'return ' + this.expr.toString();
};

TermBinding.prototype.freeVars = function(freevars) {
  var _freevars = new FreeVars(freevars);
  _freevars.bind(this.variable);
  return this.variable.freeVars(freevars);
};

TermBinding.prototype.toString = function() {
  return this.variable.toString() + ':' + this.type.toString();
};

function TypeBinding(type, kind) {
}

function KindBinding(typeFunc, kind) {
}

function Arrow(params, ret) {
  this.params = params;
  this.ret    = ret;
}

Arrow.prototype.freeVars = function(freevars) {
};

Arrow.prototype.toString = function() {
  return this.params.toString() + '->' + this.ret.toString();
};

function Lambda(binding, term) {
  this.binding = binding;
  this.term = term;
}

Lambda.prototype.freeVars = function(freevars) {
  var _freevars = this.binding.freeVars(freevars);
  return this.term.freeVars(_freevars);
};

Lambda.prototype.toString = function() {
  return '\\' + this.binding.toString() + '.' + this.term.toString();
};

function Application(lhs, rhs) {
  this.lhs = lhs;
  this.rhs = rhs;
}

Application.prototype.freeVars = function(freevars) {
  var lhs_vars = this.lhs.freeVars(freevars);
  var rhs_vars = this.rhs.freeVars(freevars);
  return concatFreeVars(lhs_vars, rhs_vars);
};

Application.prototype.toString = function() {
  return this.lhs.toString() + ' ' + this.rhs.toString();
};

function Sequence(term) {
  if(term) {
    this.terms = [term];
  } else {
    this.terms = [];
  }
}

Sequence.prototype.push = function(term) {
  this.terms.push(term);
};

Sequence.prototype.freeVars = function(freevars) {
  var fvs = _(this.terms).map(function(term) {
    return term.freeVars(freevars);
  }).union();
};

Sequence.prototype.toString = function() {
  return _(this.terms).map(function(term) {
    return term.toString();
  }).join(';\n');
};

exports.Constant    = Constant;
exports.Variable    = Variable;

exports.Store = Store;

exports.TermBinding = TermBinding;
exports.TypeBinding = TypeBinding;
exports.KindBinding = KindBinding;

exports.Arrow = Arrow;

exports.Lambda      = Lambda;
exports.Application = Application;
exports.Sequence    = Sequence;

})();

/*
var t = new Constant('int');
var x = new Variable('x');
var y = new Variable('x');
var z = new Variable('z');
var fv_x = freeVars(x);
var c = new Constant('1');
var fv_c = freeVars(c);
var lam1 = new Lambda(x, c);
var fv_lam1 = freeVars(lam1);
var lam2 = new Lambda(y, x);
var fv_lam2 = freeVars(lam2);
var app1 = new Application(lam1, x);
var fv_app1 = freeVars(app1);
var app2 = new Application(lam1, c);
var fv_app2 = freeVars(app2);
var app3 = new Application(lam1, lam2);
var fv_app3 = freeVars(app3);
var app4 = new Application(z, lam1);
var fv_app4 = freeVars(app4);

var b = new TypeBinding(x, t);
console.log(b.toString());
var lam3 = new Lambda(b, x);
console.log(lam3.toString());
var fv_lam3 = freeVars(lam3);
console.log(fv_lam3.toString());
console.log(x.toString());
console.log(fv_x.toString());
console.log(c.toString());
console.log(fv_c.toString());
console.log(lam1.toString());
console.log(fv_lam1.toString());
console.log(lam2.toString());
console.log(fv_lam2.toString());
console.log(app1.toString());
console.log(fv_app1.toString());
console.log(app2.toString());
console.log(fv_app2.toString());
console.log(app3.toString());
console.log(fv_app3.toString());
console.log(app4.toString());
console.log(fv_app4.toString());
*/
