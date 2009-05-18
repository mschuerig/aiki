dojo.provide('aiki._DataTemplated');
dojo.require('dijit._Templated');

dojo.declare('aiki._DataTemplated', dijit._Templated, {
  store: null,

  _stringRepl: function(tmpl) {
    if (this.store) {
      var savedGetObject = dojo.getObject;
      try {
        dojo.getObject = this._getStoreObject;
        return this.inherited(arguments);
      } finally {
        dojo.getObject = savedGetObject;
      }
    } else {
      return this.inherited(arguments);
    }
  },
  
  _getStoreObject: function(name, create, context) {
    var store = context.store;
    var parts = name.split('.');
    var value = context[parts[0]];
    for (var i = 1, l = parts.length; value && i < l; i++) {
      var p = parts[i];
      if (p === 'getIdentity') {
        value = store.getIdentity ? store.getIdentity(value) : null;
      } else {
        value = store.getValue(value, p);
      }
    }
    return value;
  }
});
