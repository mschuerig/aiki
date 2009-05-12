dojo.provide('aiki.SortedList');
dojo.require('dijit._Templated');
dojo.require('dijit._Widget');
dojo.require('aiki._SortedList.Item');

dojo.declare('aiki.SortedList', [dijit._Widget, dijit._Templated], {
  baseClass: 'aikiSortedList',
  templatePath: dojo.moduleUrl('aiki', '_SortedList/SortedList.html'),
  _multiValue: true,

  itemWidget: null,
  name: '',
  value: [],
  sortBy: [],

  postCreate: function() {
    this._render();
  },

  _setValueAttr: function(value) {
    this.value = value;
    if (this._started) {
      this._render();
    }
  },

  _setSortByAttr: function(sortBy) {
    this.sortBy = sortBy;
    this._sorter = this._buildSorter(sortBy);
  },

  addItem: function(item) {

  },

  removeItem: function(item) {
    var itemAndObject = aiki.find(this._items, function(it) { return it.item === item; });
    if (itemAndObject) {
      itemAndObject.item.destroyRecursive();
      var object = itemAndObject.object;
      this._items = dojo.filter(this._items, function(it) { return it.item !== item; });
      this.value  = dojo.filter(this.value,  function(it) { return it !== object; });
    }
  },

  _render: function() {
    if (this.value) {
      this._items = [];
      this.value = this.value.sort(this._sorter);

      dojo.forEach(this.value, function(object){
        var content = new this.itemWidget({
          item: object
        });
        var listItem = new aiki._SortedList.Item({
          container: this,
          content: content.domNode
        });
        this._items.push({ item: listItem, object: object });
        dojo.place(listItem.domNode, this.containerNode);
      }, this);
    }
  },

  _buildSorter: function(sortBy) {
    var comparisons = dojo.map(sortBy, function(attr) {
      switch (attr[0]) {
        case '/':
          attr = attr.substring(1);
          return { a: 'a.' + attr, b: 'b.' + attr };
        case '\\':
          attr = attr.substring(1);
          return { a: 'b.' + attr, b: 'a.' + attr };
        default:
          return { a: 'a.' + attr, b: 'b.' + attr };
      }
    });

    var tests = dojo.map(comparisons, function(cmp) {
      return dojo.string.substitute("d = (${a} || '').localeCompare(${b});", cmp)
        + "if (d !== 0) { return d; }"
    }).join("\n");

    var body = "var d = 0;\n"
      + tests + "\n"
      + "return d;"

    return new Function('a', 'b', body);
  }
});

