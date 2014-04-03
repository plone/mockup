define([
  'react',
  'mockup-registry'
], function(React, registry) {
  "use strict";

  var Patterns = React.createClass({

    displayName: 'Patterns',

    componentDidMount: function() {
      registry.scan(this.getDOMNode());
    },

    render: function() {
      return (
        this.props.children
      )
    }

  });

  return Patterns;

});

