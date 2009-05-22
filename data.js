dojo.provide('aiki.data');

(function(a) {
  a.lookupValue = function(store, item, path) {
    var parts = dojo.isString(path) ? path.split('.') : path;
    var value = item;
    for (var i = 0, l = parts.length; value && i < l; i++) {
      var p = parts[i];
      if (p === 'getIdentity') {
        value = store.getIdentity ?
          store.getIdentity(value) :
          null;
      } else {
        value = store.getValue(value, p);
      }
    }
    return value;
  };
})(dojo.getObject('aiki.data'));
