dojo.provide('aiki._SortedTable.Item');
dojo.require('aiki._SortedList.Item');

dojo.declare('aiki._SortedTable.Item', aiki._SortedList.Item, {
  baseClass: 'aikiSortedTableItem',
  templatePath: dojo.moduleUrl('aiki', '_SortedTable/Item.html'),
  
  postCreate: function() {
    if (this.index % 2 == 1) {
      dojo.addClass(this.domNode, 'dojoxGridRowOdd');
    }
  }
});
