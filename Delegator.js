dojo.provide('aiki.Delegator');

aiki.Delegator = function(/*Object*/target /*, String|Array|Function ... */) {
  // summary:
  //   Delegate a set of calls to an attribute.
  //
  // example:
  //   |dojo.declare('my.Class', [..., aiki.Delegator('servant', 'doThis', 'doThat')], {
  //   |  servant: new Servant(),
  //   |  ...
  //   |});
  //
  // example:
  //   |dojo.declare('my.Class', [..., aiki.Delegator('servant', ['myDoThis', 'theirDoThat'])], {
  //   |  servant: new Servant(),
  //   |  ...
  //   |});
  //
  // example:
  //   |dojo.declare('my.Class', [..., aiki.Delegator('servant', aiki.api.ServeMe)], {
  //   |  servant: new Servant(),
  //   |  ...
  //   |});
  //
  var proto = {};

  function delegate(method, toMethod) {
    toMethod = toMethod || method;
    if (dojo.isString(method)) {
      if (dojo.indexOf(aiki.Delegator.excludedMethods, method) > -1) {
        proto[method] = function() {
          var t = this[target];
          return t[toMethod].apply(t, arguments);
        };
      }
    } else if (dojo.isArray(method)) {
      delegate(method[0], method[1]);
    } else if (dojo.isFunction(method)) { // assume it is a constructor
      delegate(new method());
    } else if (dojo.isObject(method)) {
      for (var prop in method) {
        if (!/^(?:_|on[A-Z0-9])/.test(prop) && dojo.isFunction(method[prop])) {
          delegate(prop);
        }
      }
    } else {
      throw new Error("aiki.delegate: unsuitable delegation argument: " + method);
    }
  }

  for (var i = 1, l = arguments.length; i < l; i++) {
    delegate(arguments[i]);
  }

  function TMP() {}
  TMP.prototype = proto;
  return TMP;
};

aiki.Delegator.excludedMethods = ['constructor', 'inherited', 'getFeatures'];
