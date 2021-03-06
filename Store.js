dojo.provide('aiki.Store');
dojo.require('dojox.data.JsonRestStore');

dojo.declare("aiki.Store", dojox.data.JsonRestStore, {
  fetch: function(args) {
    console.log("*** fetch: ", args); //### REMOVE
    var query = args.query;
    var sort  = args.sort;
    if (!args.queryStr && ((query && dojo.isObject(query)) || (sort && dojo.isObject(sort)))) {
      args.queryStr = '?' + this._matchingClause(query) + this._sortingClause(sort);
    }
    //### TODO add onError unless already defined
    return this.inherited(arguments);
  },
  _matchingClause: function(query) {
    console.log("***fetch, query: ", query); //### REMOVE
    var queryStr = '';
    for (var q in query) {
      var value = query[q];
      if (value != '*') {
        var cmp = value.comparator || '=';
        queryStr += '[?' + q + cmp + "'" + (value.target || value) + "']";
      }
    }
    return queryStr;
  },
  _sortingClause: function(sort) {
    console.log("***fetch, sort: ", sort); //### REMOVE
    if (!dojo.isArray(sort) || sort.length === 0) return '';
    return '[' + dojo.map(sort, function(attr) {
      if (dojo.isObject(attr)) {
        return (attr.descending ? '\\' : '/') + attr.attribute;
      } else {
        return '/' + attr;
      }
    }).join(',') + ']';
  }
});
