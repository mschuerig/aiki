dojo.provide('aiki.SortedTable');
dojo.require('aiki.SortedList');
dojo.require('aiki._SortedTable.Item');

dojo.declare('aiki.SortedTable', aiki.SortedList, {
  baseClass: 'aikiSortedTable',

  templatePath: dojo.moduleUrl('aiki', '_SortedTable/SortedTable.html'),
  itemWidget: aiki._SortedTable.Item,

  _fillContent: function(/*DomNode*/ source){
    var dest = this.containerNode;
    if(source && dest){
      while(source.hasChildNodes()){
        dest.insertBefore(source.firstChild, this.listNode);
      }
    }
  }
});
