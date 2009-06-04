dojo.provide('aiki._QueriedListMixin');
dojo.require('dojo._base');
dojo.require('dojo._base.event');
dojo.require('dijit.Menu');
dojo.require('dijit.MenuItem');
dojo.require('dijit.MenuSeparator');
dojo.require('dijit.Tooltip');
dojo.require('aiki.array');
dojo.require('aiki.Action');
dojo.require('aiki.QueryParser');
dojo.require('aiki.QueryHelp');

dojo.declare('aiki._QueriedListMixin', null, {

  actions: null,
  _contextItemName: 'item',

  _initGrid: function(grid, props) {
    grid.attr('structure', props.gridStructure);
    grid.setSortInfo(props.sortInfo);
    grid.setQuery(props.query);
    grid.attr('rowsPerPage', props.rowsPerPage);
    grid.attr('keepRows', props.keepRows);
    grid.setStore(props.store);
  },

  _connectGridTopics: function(kind, grid) {
    dojo.connect(grid, 'onRowDblClick', function(event) {
      dojo.publish(kind + '.selected', [grid.getItem(event.rowIndex)]);
    });
  },

  _connectButtonTopics: function(kind, buttons) {
    for (var action in buttons) {
      var button = buttons[action];
      if (button) {
        (function(action) {
          dojo.connect(button, 'onSubmit', function(event) {
            dojo.stopEvent(event);
            dojo.publish(kind + '.' + action);
          });
        })(action);
      }
    }
  },

  _connectQuerying: function(grid, queryForm, queryField, allowedAttributes, defaultAttribute) {
    var queryParser = new aiki.QueryParser(allowedAttributes, defaultAttribute);

    dojo.connect(queryForm, 'onSubmit', function(event) {
      dojo.stopEvent(event);
      var queryStr = queryField.attr('value');
      grid.setQuery(queryParser.parse(queryStr));
    });

    if (dojo.isFunction(queryForm.resetSubmitButtons)) {
      dojo.connect(grid, '_onFetchComplete', function() { // NOTE abuse a DataGrid private hook
        queryForm.resetSubmitButtons();
      });
    }
  },

  _gridContextMenu: function(grid, actionFactory) {
    actionFactory = actionFactory || dojo.hitch(this, '_getActions');
    var menu = this._contextMenu = (this._contextMenu || new dijit.Menu());
    var itemName = this._contextItemName;

    var showMenu = function(e) {
      var context = {};
      context[itemName] = e.grid.getItem(e.rowIndex);
      var actions = actionFactory(context, e);
      if (actions && actions.length > 0) {
        dojo.forEach(actions, function(action, i) {
          if (action === '-') {
            if (i !== 0 && i !== actions.length - 1) {
              menu.addChild(new dijit.MenuSeparator());
            }
          } else if (dojo.isString(action)) {
            menu.addChild(new dijit.MenuItem({
              label:    action,
              disabled: true
            }));
          } else {
            menu.addChild(new dijit.MenuItem({
              label:    action.label,
              onClick:  dojo.partial(action.execute, context),
              disabled: action.disabled
            }));
          }
        });
        menu.startup();
        menu._openMyself(e);
      }
    };

    dojo.connect(grid, 'onCellContextMenu', showMenu);
    dojo.connect(menu, 'onClose', menu, 'destroyDescendants');
  },

  _gridTooltips: function(grid, messageCallback) {
    var showTooltip = function(e) {
      var item = e.grid.getItem(e.rowIndex);
      if (item) {
        var msg = messageCallback(item, e);
        if (msg) {
          dijit.showTooltip(msg, e.cellNode);
        }
      }
    };
    var hideTooltip = function(e) {
      dijit.hideTooltip(e.cellNode);
      dijit._masterTT._onDeck=null;
    };
    dojo.connect(grid, "onCellMouseOver", showTooltip);
    dojo.connect(grid, "onCellMouseOut", hideTooltip);
  },

  _makeQueryHelp: function(helpNode, attributes, defaultAttribute) {
    var help = new aiki.QueryHelp({
      attributes: attributes,
      defaultAttribute: defaultAttribute
    });
    helpNode.attr('content', help);
  },

  _setActionsAttr: function(actions) {
    this.actions = [].concat(actions);
  },

  _addTopAction: function(label, execute, enabled) {
    this._topActions = this._topActions || [];
    if (execute) {
      this._topActions.push(new aiki.Action(label, execute, enabled));
    } else {
      this._topActions.push(label);
    }
  },

  _getActions: function(context) {
    var actionSpecs = (this._topActions || []).concat(this.actions || []);
    var actions = [];
    for (var i = 0, l = actionSpecs.length; i < l; i++) {
      var action = actionSpecs[i];
      if (dojo.isFunction(action)) {
        actions = actions.concat(action(context));
      } else {
        actions.push(action);
      }
    }
    return actions;
  }
});
