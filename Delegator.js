dojo.provide('aiki.Delegator');

aiki.Delegator = function(/*Object*/target /*, String ... */) {
  // summary:
  //   Delegate a set of calls to an attribute.
  //
  // example:
  //   |dojo.declare('my.Class', [..., aiki.Delegator('servant', 'doThis', 'doThat')], {
  //   |  servant: new Servant(),
  //   |  ...
  //   |});
  //
  //### TODO
  // - connect events (onX, _onX)
  // - support API delegation: aiki.Delegator('impl', aiki.api.Editor)
  var proto = {};
  for (var i = 1, l = arguments.length; i < l; i++) {
    (function(method) {
       proto[method] = function() {
         var t = this[target];
         return t[method].apply(t, arguments);
       };
     })(arguments[i]);
  }
  function TMP() {}
  TMP.prototype = proto;
  return TMP;
};
