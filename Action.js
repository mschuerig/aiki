dojo.provide('aiki.Action');

//### TODO API description
dojo.declare('aiki.Action', null, {
  constructor: function(label, execute, enabled) {
    this.label = label;
    this.execute = execute;
    this.enabled = (arguments.length >= 3) ? enabled : true;
    this.disabled = !this.enabled;
  }
});
