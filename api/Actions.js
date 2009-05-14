dojo.provide("aiki.api.Actions");

dojo.declare("aiki.api.Actions", null, {

  getFeatures: function(){
    return {
      "aiki.api.Actions": true
    }
  },

  getActions: function(context) {
    throw new Error('Unimplemented API: aiki.api.Edit.getActions');
  }
});
