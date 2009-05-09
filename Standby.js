dojo.provide('aiki.Standby');
dojo.require('dojox.widget.Standby');

dojo.declare('aiki.Standby', null, {

  constructor: function(targetNode, stopped) {
    this._targetNode = targetNode;
    if (!stopped) {
      this.start();
    }
  },

  start: function() {
    var standbyNode = dojo.create('div', {}, dojo.body());
    this._standby = new dojox.widget.Standby({ target: this._targetNode }, standbyNode);
    this._standby.show();
  },

  stop: function() {
    if (this._standby) {
      this._standby.hide();
      this._standby.destroyRecursive();
      this._standby = null;
    }
  }
});
