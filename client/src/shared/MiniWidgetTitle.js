/**
 * A mini title for a widget
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';

// Widget propType
import Widget from './propTypes/Widget';

class MiniWidgetTitle extends Component {
  /**
   * Render MiniWidgetTitle
   * @author Gabe Abrams
   */
  render() {
    const { widget } = this.props;

    return (
      <div className="alert alert-info d-inline-block mb-0 pt-0 pb-0 pl-2 pr-2">
        {widget.metadata.title}
      </div>
    );
  }
}

MiniWidgetTitle.propTypes = {
  // The widget to show
  widget: Widget.isRequired,
};

export default MiniWidgetTitle;
