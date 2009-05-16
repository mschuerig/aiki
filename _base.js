dojo.provide('aiki._base');

(function(a) {

  a.find = function(/*Array|String*/arr, /*Function|String*/callback, /*Object?*/thisObject) {
    var pred = dojo.hitch(thisObject, callback);
    var result;
    var found = dojo.some(arr, function(v){
      if(pred(v)) {
        result = v;
        return true;
      }
      return false;
    });
    return result;
  };

  a.groupBy = function(/*Array*/items, /*Function*/extractor) {
    var keys = [];
    var groups = {};
    for (var i = 0, l = items.length; i < l; i++) {
      var item = items[i];
      var key = extractor(item);
      var group = groups[key];
      if (!group) {
        keys.push(key);
        group = groups[key] = [];
      }
      group.push(item);
    }
    return { keys: keys, groups: groups };
  };

  a.relay = function(/*Object*/source, /*Object*/dest /*, String|Array ... */) {
    for (var i = 2, l = arguments.length; i < l; i++) {
      var event = arguments[i];
      if (dojo.isString(event)) {
        dojo.connect(source, event, dest, event);
      } else if (dojo.isArray(event) && event.length == 2) {
        dojo.connect(source, event[0], dest, event[1]);
      } else {
        throw new Error("aiki.relay: Unsupported event descriptor: " + event);
      }
    }
  };

  a.hilite = function(node, duration) {
    if (node.domNode) {
      node = node.domNode;
    }
    dojo.animateProperty({
      node: node,
      duration: duration || 2000,
      properties: {
        backgroundColor: {
          start: '#FFFF00',
          end:   '#FFFFFF'
        }
      }
    }).play();
  };
})(aiki);
