dojo.provide('aiki._DataTemplated');
dojo.require('dijit._Templated');
dojo.require('aiki.data');

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
    try {
      var parts = name.split('.');
      var item = context[parts.shift()];
      return aiki.data.lookupValue(context.store, item, parts)
    } catch (e) {
      console.error('aiki._DataTemplated._getStoreObject', e, name, context);
      throw e;
    }
  }
});
