dojo.provide('aiki.Action');

//### TODO API description
dojo.declare('aiki.Action', null, {
  constructor: function(/*String*/label, /*Function*/execute, /*Boolean?*/enabled) {
    this.label = label;
    this.execute = execute;
    this.enabled = enabled !== false;
    this.disabled = !this.enabled;
  }
});
