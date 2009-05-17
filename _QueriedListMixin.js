dojo.provide('aiki._QueriedListMixin');
dojo.require('aiki.QueryParser');
dojo.require('aiki.QueryHelp');

dojo.declare('aiki._QueriedListMixin', null, {
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
    this._makeQueryFieldTooltip(this.queryFieldNode, allowedAttributes, defaultAttribute);

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

  _gridTooltips: function(grid, messageCallback) {
    var showTooltip = function(e) {
      var item = e.grid.getItem(e.rowIndex);
      if (item) {
        var msg = messageCallback(item);
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

  _makeQueryFieldTooltip: function(fieldWidget, attributes, defaultAttribute) {
    var help = new aiki.QueryHelp({
      attributes: attributes,
      defaultAttribute: defaultAttribute
    });
    help.render();
    return new dijit.Tooltip({
      connectId: [fieldWidget.domNode],
      label: help.domNode.innerHTML,
      position: ['below', 'above']
    });
  }

});
