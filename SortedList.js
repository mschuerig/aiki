dojo.provide('aiki.SortedList');
dojo.require('dijit.form._FormWidget');
dojo.require('aiki.array');
dojo.require('aiki._SortedList.Item');

//### TODO store-backed, take Notification API into account
dojo.declare('aiki.SortedList', dijit.form._FormWidget, {
  baseClass: 'aikiSortedList',

  templatePath: dojo.moduleUrl('aiki', '_SortedList/SortedList.html'),

  attributeMap: dojo.delegate(dijit.form._FormWidget.prototype.attributeMap, {
    size: "focusNode"
  }),

  scrollOnFocus: false,
  _multiValue: true,

  name: '',
  store: null,
  itemWidget: null,
  value: [],
  sortBy: [],

  _setValueAttr: function(value, priorityChange) {
    var objects = aiki.array.dup(value); //### FIXME don't set _objects
    this._handleOnChange(objects, priorityChange);
    this._render();
  },

  _getValueAttr: function(){
    return this._lastValue ? aiki.array.dup(this._lastValue) : null;
  },

  _setSortByAttr: function(sortBy) {
    this.sortBy = sortBy;
    this._sorter = null;
    this._render();
  },

  compare: function(val1, val2) {
    var l1 = val1.length, l2 = val2.length;
    if (l1 < l2) {
      return -1;
    }
    if (l1 > l2) {
      return 1;
    }
    for (var i = 0; i < l1; i++) {
      var cmp = this._compareObjects(val1[i], val2[2]);
      if (cmp != 0) {
        return cmp;
      }
    }
    return 0;
  },

  hasObject: function(object) {
    return !!this._findByObject(object);
  },

  addObject: function(object) {
    var objects = aiki.array.dup(this.attr('value'));
    objects.push(object);
    this.attr('value', objects);
    this.onObjectAdded(object, this._findByObject(object).item);
  },

  removeObject: function(object) {
    var objects = aiki.array.dup(this.attr('value'));
    var oldLen = objects.length;
    objects = dojo.filter(objects, function(obj) { return obj !== object; });
    if (objects.length < oldLen) {
      this.attr('value', objects);
      this.onObjectRemoved(object);
    }
  },

  removeItem: function(item) {
    var itemAndObject = this._findByItem(item);
    if (itemAndObject) {
      this.removeObject(itemAndObject.object);
    }
  },

  onObjectAdded: function(object, item) {
  },

  onObjectRemoved: function(object) {
  },

  _render: function() {
    if (!this._started) {
      return;
    }
    var objects = this.attr('value');
    if (objects) {
      objects.sort(this._getSorter());
      this._items = [];
      this.destroyDescendants();

      dojo.forEach(objects, function(object){
        var content = new this.itemWidget({
          store: this.store,
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

  _compareObjects: function(obj1, obj2) {
    return obj1 === obj2 ? 0 : -1; // arbitrarily return -1 for unequal objects
  },

  _getSorter: function() {
    if (!this._sorter) {
      this._sorter = this.sortBy ?
        dojo.hitch(this, this._buildSorter(this.sortBy)) :
        function(a, b) { return 0; };
    }
    return this._sorter;
  },

  _buildSorter: function(sortBy) {
    //### TODO compare & constrast dojo.data.util.sorter
    //### TODO accept attribute paths
    var attrAccess = this.store ?
      function(item, attr) { return 'this.store.getValue(' + item + ',"' + attr + '")'; } :
      function(item, attr) { return item + '.' + attr; };

    var comparisons = dojo.map(sortBy, function(attr) {
      switch (attr[0]) {
        case '/':
          attr = attr.substring(1);
          return { a: attrAccess('a', attr), b: attrAccess('b', attr) };
        case '\\':
          attr = attr.substring(1);
          return { a: attrAccess('b', attr), b: attrAccess('a', attr) };
        default:
          return { a: attrAccess('a', attr), b: attrAccess('b', attr) };
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

