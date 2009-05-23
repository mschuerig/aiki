dojo.provide('aiki._SortedList.Item');
dojo.require('dojo.html');
dojo.require('dojo.i18n');
dojo.require('dijit._Templated');
dojo.require('dijit._Widget');
dojo.require('dijit.form.Button');
dojo.requireLocalization('aiki', 'common');

dojo.declare('aiki._SortedList.Item', [dijit._Widget, dijit._Templated], {
  baseClass: 'aikiSortedListItem',
  templatePath: dojo.moduleUrl('aiki', '_SortedList/Item.html'),
  widgetsInTemplate: true,

  container: null,
  content: null,

  postMixInProperties: function() {
    this.removeButtonClass = this.baseClass + 'RemoveButton';
    this._nls = dojo.i18n.getLocalization('aiki', 'common');
  },

  postCreate: function() {
    dojo.connect(this.removeButtonNode, 'onClick',
      dojo.hitch(this.container, 'removeItem', this));
  },

  _setContentAttr: function(content) {
    if (this.afterContentChildrenNode) {
      while (this.contentNode.firstChild != this.afterContentChildrenNode) {
        dojo.destroy(this.contentNode.firstChild);
      }
      while (content.hasChildNodes()) {
        this.contentNode.insertBefore(content.firstChild, this.afterContentChildrenNode);
      }
    } else {
      dojo.html.set(this.contentNode, content);
    }
  }
});
