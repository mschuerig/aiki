dojo.provide("aiki.api.Edit");
dojo.require("aiki.api.View");

dojo.declare("aiki.api.Edit", aiki.api.View, {

  getFeatures: function(){
    return {
      "aiki.api.View": true,
      "aiki.api.Edit": true
    };
  },

  isModified: function() {
    throw new Error('Unimplemented API: aiki.api.Edit.isModified');
  },

  onCreated: function() {
  },
  onSaved: function() {
  },
  onError: function() {
  },
  onChange: function() {
  },
  onModified: function() {
  },
  onReverted: function() {
  }
});
