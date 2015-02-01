(function(){
  'use strict';

var _ = require('underscore');

var elab = require('./elaboration');
var en   = require('./environment');
var symbol = require('./syntax').symbol;

function Elaboration(term, meta) {
  this.term = term;
  this.meta = meta;
}

Elaboration.prototype.toString = function() {
  return '<' + this.term.toString() + ', ' + this.meta.toString() + '>';
};

function elaborate_seq(env, t) {
  return _(t).map(function(_t) {
    return _elaborate(env, _t);
  });
}

function elaborate_def(env, t) {
  var _decl = _elaborate(env, t[0]);
  var _init = t[1] ? _elaborate(env, t[1]) : null;

  return {
    first: _decl,
    second: _init
  };
}

// ========================
// (S, D, G) |- t[0] : t[1]
// ========================

function elaborate_decl_term(env, t) {
  var scope = env.currScope();
  // Validate t0 is not already defined in term scope
  if(t[0].name === symbol.X) {
    if(scope.hasTerm(t[0].t[0])) {
      throw 'Term already bound: '+t[0].t[0];
    }
  } else if(t[0].name === symbol.PROJECTION) {
  } else {
    throw 'Expected '+symbol.X + ' got '+t[0].toString();
  }
  // Validate type is good
  elaborate_type(env, term[1]);
}

// =========================
// (s, D, G) |- t[0] :: t[1] 
// =========================

function elaborate_decl_type(env, t) {
  var scope = env.currScope();
  if(t[0].name === symbol.X) {
    if(scope.hasType(t[0].t[0])) {
      throw 'Type already bound: '+t[0].t[0];
    }
  } else if(t[0].name === symbol.PROJECTION) {
  } else {
    throw 'Expected '+symbol.X + ' got '+t[0].toString();
  }
  // Validate type is good
}

// ========================================================
// 1. t[0]                  - Binding target is free
// 2. t[1]                  - Type is well formed
// 3. D' <- <t[0]:::t[1]>,D - Bind pair in type environment
// --------------------------------------------------------
// (S, D, G) |- t[0] :: t[1]
// ========================================================

function elaborate_decl_kind(env, t) {
  var name, type;
  var scope = env.currScope();

  // 1. t[0] - Binding target is free
  if(t[0].name === symbol.X) {
    name = t[0].t[0];
    if(scope.hasType(name)) {
      throw 'Type already bound: ' + name;
    }
  } else if(t[0].name === symbol.PROJECTION) {
  } else {
    throw 'Expected '+symbol.X + ' got '+t[0].toString();
  }

  // 2. t[1] - Kind is well formed
  if(t[1].name === symbol.X) {
    kind = t[1].t[0];
    if(!env.hasKind(kind)) {
      throw 'Kind not found: '+kind;
    }
  } if(t[1].name === symbol.RARROW) {

  } else {
    throw 'Expected '+symbol.X + ' got '+t[0].toString();
  }

  // 3. S' <- <t[0]:::t[1]>,S - Bind pair in kind environment
  scope.bindKind(name, kind);

  return {
    first: t,
    second: kind
  };
}

function elaborate_kind(env, t) {
  var name, meta, id, _t;
  id = t[0].name;
  _t = t[0].t;
  switch(id) {
    case symbol.X:
      name = _t[0];
      if(!env.hasKind(name)) {
      }
      return {
      };
    case symbol.RARROW:
      return ;
    default:
      throw 'Invalid kind: ' + t.toString();
  }
}

// ========================================================
// 1. t[0]                  - Binding target is free
// 2. t[1]                  - Kind is well formed
// 3. S' <- <t[0]:::t[1]>,S - Bind pair in kind environment
// --------------------------------------------------------
// (S, D, G) |- t[0] ::: t[1]
// ========================================================

/*
function elaborate_decl_kind(env, t) {
  var name, kind;
  var scope = env.currScope();

  // 1. t[0] - Binding target is free
  if(t[0].name === symbol.X) {
    name = t[0].t[0];
    if(scope.hasKind(name)) {
      throw 'Kind already bound: ' + name;
    }
  } else if(t[0].name === symbol.PROJECTION) {
  } else {
    throw 'Expected '+symbol.X + ' got '+t[0].toString();
  }

  // 2. t[1] - Kind is well formed
  if(t[1].name === symbol.X) {
    kind = t[1].t[0];
    if(!env.hasKind(kind)) {
      throw 'Kind not found: '+kind;
    }
  } if(t[1].name === symbol.RARROW) {

  } else {
    throw 'Expected '+symbol.X + ' got '+t[0].toString();
  }

  // 3. S' <- <t[0]:::t[1]>,S - Bind pair in kind environment
  scope.bindKind(name, kind);

  return {
    first: t,
    second: kind
  };
}
*/

function elaborate_x(env, term) {

}

function _elaborate(env, term) {
  console.log('sym: '+term.name);
  switch(term.name) {
    case symbol.SEQ:
      return elaborate_seq(env, term.t);
    case symbol.DEF:
      return elaborate_def(env, term.t);
    case symbol.X:
      return elaborate_x(env, term.t);
    case symbol.TERM:
      return elaborate_decl_term(env, term.t);
    case symbol.TYPE:
      return elaborate_decl_type(env, term.t);
    case symbol.KIND:
      return elaborate_decl_kind(env, term.t);
    default:
      throw 'Elaboration: ' + term;
  }
}

function elaborate(term) {
  return _elaborate(new en.Stack(), term);
}

exports.elaborate = elaborate;

})();

