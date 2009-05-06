dojo.provide("aiki.api.View");

dojo.declare("aiki.api.View", null, {

  getFeatures: function(){
	return {
	  "aiki.api.View": true
	};
  },

  whenReady: function(callback) {
    throw new Error('Unimplemented API: aiki.api.View.whenReady');
  },

  getTitle: function() {
    throw new Error('Unimplemented API: aiki.api.View.getTitle');
  }
});
