dojo.provide('aiki.EditorManager');
dojo.require('aiki._base');
dojo.require('aiki.Standby');

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

    this.actions = dojo.hitch(this, 'getActions');
  },

  editObject: function(object, store, widgetType, /* Object? */options) {
    options = options || {};
    var editorReady = new dojo.Deferred();
    if (dojo.isString(object)) {
      store.fetchItemByIdentity({
        identity: object,
        scope: this,
        onItem: function(item) { this._edit(item, store, widgetType, editorReady, options); },
        onError: function(err) { console.error(err); } //###
      });
    } else {
      this._edit(object, store, widgetType, editorReady, options);
    }
    return editorReady;
  },

  newObject: function(store, widgetType, options) {
    var editorReady = new dojo.Deferred();
    this._edit(null, store, widgetType, editorReady, options || {});
    return editorReady;
  },

  getCurrentEditor: function() {
    return this.container.selectedChildWidget;
  },

  getActions: function(context) {
    var editor = this.getCurrentEditor();
    if (editor && editor.getFeatures()['aiki.api.Actions']) {
      return editor.getActions(context);
    } else {
      return [];
    }
  },

  _edit: function(object, store, widgetType, editorReady, options) {
    var editor = this._editorFor('object', object);

    if (!editor) {
      editor = this._makeEditor(object, store, widgetType, options);

      editor.widget.whenReady(dojo.hitch(this, function() {
        this._stopStandby(editor);
      }));
    }

    editor.widget.whenReady(function() {
      editorReady.callback(editor);
    });

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
    var widget = new widgetType(dojo.mixin(options, { store: store, object: object }));

    widget = dojo.mixin(widget, {
      showLabel: true,
      closable: true,
      onClose: this._makeOnCloseHandler(widget)
    });
    this.container.addChild(widget);
    this._makeTitleUpdater(widget);

    var editor = {
      object: object,
      widget: widget,
      standby: this._startStandby(widget)
    };

    this._editors.push(editor);

    return editor;
  },

  _makeTitleUpdater: function(widget) {
    if (this.container.tablist) {
      var tabButton = this.container.tablist.pane2button[widget];

      var titlePostProc = widget.getFeatures()['aiki.api.Edit'] ?
        function(title) { return widget.isModified() ? ('*' + title) : title; } :
        function(title) { return title; };

      var updateTitle = function() {
        var title = widget.isReady() ? titlePostProc(widget.getTitle()) : widget.loadingLabel;
        tabButton.attr('label', title);
      };

      updateTitle();

      widget.whenReady(updateTitle);
      dojo.connect(widget, 'onChange', updateTitle);
    }
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

  _editorFor: function(key, object) {
    return aiki.find(this._editors, function(item) {
      return item[key] === object;
    });
  },

  _startStandby: function(widget) {
    return new aiki.Standby(widget.domNode.parentNode);
  },

  _stopStandby: function(editor) {
    if (editor.standby) {
      editor.standby.stop();
      delete editor.standby;
    }
  }
});
