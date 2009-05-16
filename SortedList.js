dojo.provide('aiki.SortedList');
dojo.require('dijit._Templated');
dojo.require('dijit._Widget');
dojo.require('aiki._SortedList.Item');

//### TODO store-backed, take Notification API into account
dojo.declare('aiki.SortedList', [dijit._Widget, dijit._Templated], {
  baseClass: 'aikiSortedList',
  templatePath: dojo.moduleUrl('aiki', '_SortedList/SortedList.html'),
  _multiValue: true,

  itemWidget: null,
  name: '',
  value: [],
  sortBy: [], //### TODO this should really be a function to enable item opacity

  postCreate: function() {
    this._render();
  },

  _setValueAttr: function(value) {
    this.value = [];
    for (var i = 0, l = value.length; i < l; i++) {
      this.value.push(value[i]);
    }
    this._render();
  },

  _setSortByAttr: function(sortBy) {
    this.sortBy = sortBy;
    this._sorter = this._buildSorter(sortBy);
  },


  hasObject: function(object) {
    return !!this._findByObject(object);
  },

  addObject: function(object) {
    this.value.push(object);
    this._render();
    this._onObjectAdded(object, this._findByObject(object).item);
  },

  removeObject: function(object) {
    this._removeListItem(this._findByObject(object));
  },

  removeItem: function(item) {
    this._removeListItem(this._findByItem(item));
  },

  onObjectAdded: function(object, item) {
  },

  onObjectRemoved: function(object) {
  },

  onChange: function() {
  },

  _onObjectAdded: function(object, item) {
    this.onObjectAdded(object, item);
    this.onChange();
  },

  _onObjectRemoved: function(object) {
    this.onObjectRemoved(object);
    this.onChange();
  },

  _removeListItem: function(itemAndObject) {
    if (itemAndObject) {
      itemAndObject.item.destroyRecursive();
      var item   = itemAndObject.item;
      var object = itemAndObject.object;
      this._items = dojo.filter(this._items, function(it) { return it.item !== item; });
      this.value  = dojo.filter(this.value,  function(it) { return it !== object; });
      this._onObjectRemoved(object);
    }
  },

  _render: function() {
    if (this._started && this.value) {
      this._items = [];
      this.destroyDescendants();
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

  _findByItem: function(item) {
    return aiki.find(this._items, function(it) { return it.item === item; });
  },

  _findByObject: function(object) {
    return aiki.find(this._items, function(it) { return it.object === object; });
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

