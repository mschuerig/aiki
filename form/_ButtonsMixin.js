dojo.provide('aiki.form._ButtonsMixin');
dojo.require('dijit.form.Button');

dojo.declare('aiki.form._ButtonsMixin', null, {
  // summary:
  //   Common functions for handling submit buttons in forms.
  //
  resetSubmitButtons: function() {
    // tags:
    //   protected
    this.buttons().forEach(function(button) {
      if (dojo.isFunction(button.cancel)) {
        button.cancel();
      }
    });
  },

  enableSubmitButtons: function() {
    // tags:
    //   protected
    this._setButtonsAttribute('disabled', false);
  },

  disableSubmitButtons: function() {
    // tags:
    //   protected
    this._setButtonsAttribute('disabled', true);
  },

  buttons: function() {
    // tags:
    //   protected
    return this.getDescendants().filter(function(widget) {
      return (widget instanceof dijit.form.Button);
    });
  },

  _setButtonsAttribute: function(attr, value) {
    this.buttons().forEach(function(button) {
      button.attr(attr, value);
    });
  }
});
