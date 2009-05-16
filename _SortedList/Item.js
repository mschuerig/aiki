dojo.provide('aiki._SortedList.Item');
dojo.require('dojo.html');
dojo.require('dijit._Templated');
dojo.require('dijit._Widget');
dojo.require('dijit.form.Button');

dojo.declare('aiki._SortedList.Item', [dijit._Widget, dijit._Templated], {
  baseClass: 'aikiSortedListItem',
  templatePath: dojo.moduleUrl('aiki', '_SortedList/Item.html'),
  widgetsInTemplate: true,

  container: null,
  content: null,

  postMixInProperties: function() {
    this.removeIconClass = this.baseClass + 'RemoveButton';
  },

  postCreate: function() {
    dojo.connect(this.removeButtonNode, 'onClick', console.warn); //###
    dojo.connect(this.removeButtonNode, 'onClick',
      dojo.hitch(this.container, 'removeItem', this));
  },

  _setContentAttr: function(content) {
    dojo.html.set(this.contentNode, content);
  }
});
