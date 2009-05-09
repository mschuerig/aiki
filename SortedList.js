dojo.provide('aiki.SortedList');
dojo.require('dijit._Templated');
dojo.require('dijit._Widget');

dojo.declare('aiki.SortedList', [dijit._Widget, dijit._Templated], {
  baseClass: 'moviedbAwardView',
  templatePath: dojo.moduleUrl('aiki', '_SortedList/SortedList.html'),

  itemWidget: null,
  sortBy: [],
  items: [],
  
  postCreate: function() {
    this._render();
  },
  
  _setItemsAttr: function(items) {
/*
    if (dojo.isArray(items) && items.length === 1 && dojo.isString(items[0])) {
      this.items = null;
      var parent, object;
      if ((parent = this.getContainer())) {
        if ((object = parent.attr('object'))) {
          this.items = object[items[0]];
        }
      }
    } else {
*/
      this.items = items;
//    }
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
    
  },
  
  _render: function() {
    if (this.items) {
      this.items = this.items.sort(this._sorter);
      
      dojo.forEach(this.items, function(item){
        var listItem = dojo.create('li');
        var content = new this.itemWidget({
          item: item
        });
        dojo.place(listItem, this.containerNode);
        dojo.place(content.domNode, listItem);
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
    
//    console.debug('*** SORTER: ', body); //### REMOVE
    return new Function('a', 'b', body);
  }
});

