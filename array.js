dojo.provide('aiki.array');

(function(a) {

  a.dup = function(arr) {
    var l = arr.length;
    var copy = new Array(l);
    for (var i = 0; i < l; i++) {
      copy[i] = arr[i];
    }
    return copy;
  }

})(dojo.getObject('aiki.array'));
