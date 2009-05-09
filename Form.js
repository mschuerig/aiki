dojo.provide('aiki.Form');
dojo.require('dijit.form.Form');
dojo.require('aiki.form._ButtonsMixin');
dojo.require('aiki.form._DataMixin');
dojo.require('aiki.form._ModificationEventsMixin');

dojo.declare('aiki.Form', [dijit.form.Form,
  aiki.form._DataMixin, aiki.form._ButtonsMixin, aiki.form._ModificationEventsMixin], {

  onSubmit: function(event) {
    dojo.stopEvent(event);
    if (this.isValid()) {
      this.save();
    }
    return false;
  },

  onReset: function() {
    this.resetSubmitButtons();
    return this.inherited(arguments);
  },

  onPopulated: function(object) {
    console.debug('*** FORM ON POPULATED'); //### REMOVE
    this.markUnmodified();
    this.resetSubmitButtons();
    this.watchForChanges();
  },

  onModified: function() {
//    this.enableSubmitButtons();
  },

  onReverted: function() {
//### TODO doesn't work well with mouse interaction.
// When the cursor is still in a changed field, the submit button can't be clicked.
//    this.disableSubmitButtons();
  },

  onSaved: function() {
    this.markUnmodified();
    this.resetSubmitButtons();
  },

  onError: function() {
    this.resetSubmitButtons();
  }
});
