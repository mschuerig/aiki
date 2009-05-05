dojo.provide('aiki.EditorManager');
dojo.require('dojox.widget.Standby');
dojo.require('aiki._base');

dojo.declare('aiki.EditorManager', null, {
  // summary:
  //   Manage a list of objects and their associated editors.
  //

  constructor: function(options) {
    this._editors = [];
    if (options) {
      dojo.mixin(this, options);
    }
    this.container = dijit.byId(this.container);
    dojo.subscribe(this.container.id + '-removeChild', this, 'editorClosed');
  },

  editObject: function(object, store, widgetType, /* Object? */options) {
    options = options || {};
    var whenReady = new dojo.Deferred();
    if (dojo.isString(object)) {
      store.fetchItemByIdentity({
        identity: object,
        scope: this,
        onItem: function(item) { this._edit(item, store, widgetType, whenReady, options); }
      });
    } else {
      this._edit(object, store, widgetType, whenReady, options);
    }
    return whenReady;
  },

  newObject: function(store, widgetType, options) {
    var whenReady = new dojo.Deferred();
    this._edit(null, store, widgetType, whenReady, options || {});
    return whenReady;
  },

  _edit: function(object, store, widgetType, whenReady, options) {
    var editor = this._editorFor('object', object);
    if (!editor) {
      editor = this._makeEditor(object, store, widgetType, options);

      dojo.connect(editor.widget, 'onReady', dojo.hitch(this, function() {
        this._stopStandby(editor);
        whenReady.callback(editor);
      }));
    } else {
      whenReady.callback(editor);
    }
    this.selectEditor(editor);
  },

  selectEditor: function(editor) {
    var widget = editor.widget;
    this.container.selectChild(widget);
  },

  editorClosed: function(widget) {
    this._stopStandby(this._editorFor('widget', widget));
    this._editors = dojo.filter(this._editors, function(item) {
      return item.widget !== widget;
    });
  },

  _makeEditor: function(object, store, widgetType, options) {
    //### TODO keep widget options and our own apart
    widgetType = dojo.isString(widgetType) ? dojo.getObject(widgetType) : widgetType;
    var widget = new widgetType(dojo.mixin(options,
      { store: store, object: object }));

    widget = dojo.mixin(widget, {
      showLabel: true,
      closable: true,
      onClose: this._makeOnCloseHandler(widget)
    });
    this.container.addChild(widget);
    this._editors.push({object: object, widget: widget});

    if (this.container.tablist) {
      var tabButton = this.container.tablist.pane2button[widget];
      var updateTitle = function() {
        var title = widget.getTitle();
        widget.attr('title', title);
        tabButton.attr('label', title);
      };
      updateTitle();
      dojo.connect(widget, 'onChange', updateTitle);
    }

    var standby = this._startStandby(widget);
    return { object: object, widget: widget, standby: standby };
  },

  _makeOnCloseHandler: function(widget) {
    if (widget.getFeatures()['aiki.api.Edit']) {
      return function() {
        if (widget.isModified()) {
          return confirm("Are you sure you want to discard your changes?");
        }
        return true;
      };
    } else {
      return function() { return true; };
    }
  },

  _startStandby: function(widget) {
    var standbyNode = dojo.create('div', {}, dojo.body());
    var standby = new dojox.widget.Standby({ target: widget.domNode.parentNode }, standbyNode);
    standby.show();
    return standby;
  },

  _stopStandby: function(editor) {
    console.debug('*** stop standby: ', editor); //### REMOVE
    if (editor.standby) {
      editor.standby.destroyRecursive();
      delete editor.standby;
    }
  },

  _editorFor: function(key, object) {
    return aiki.find(this._editors, function(item) {
      return item[key] === object;
    });
  }
});
