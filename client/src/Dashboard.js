/**
 * Widget dashboard
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import animator
import FlipMove from 'react-flip-move';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPlus, faStore } from '@fortawesome/free-solid-svg-icons';

// Import shared prop types
import Widget from './shared/propTypes/Widget';

// Import shared components
import WidgetContainer from './shared/WidgetContainer';

class Dashboard extends Component {
  /**
   * Render Dashboard
   * @author Gabe Abrams
   */
  render() {
    const {
      widgetPairs,
      onOpenConfiguration,
      onOpenHelp,
      onChangeConfiguration,
      onMoveWidget,
      onRemoveWidget,
      onOpenWidgetStore,
    } = this.props;

    const widgetContainers = widgetPairs.map((widgetPair, i) => {
      const { widget, configuration } = widgetPair;

      const widgetAtTopOfList = (i === 0);
      const widgetAtBottomOfList = (i === widgetPairs.length - 1);

      return (
        <WidgetContainer
          key={widget.id}
          widget={widget}
          configuration={configuration}
          onOpenConfiguration={() => {
            onOpenConfiguration(widget.id);
          }}
          onOpenHelp={() => {
            onOpenHelp(widget.id);
          }}
          onChangeConfiguration={(newConfiguration) => {
            onChangeConfiguration(widget.id, newConfiguration);
          }}
          onMoveWidgetUp={() => {
            onMoveWidget(widget.id, true);
          }}
          onMoveWidgetDown={() => {
            onMoveWidget(widget.id, false);
          }}
          onRemoveWidget={() => {
            onRemoveWidget(widget.id);
          }}
          widgetAtTopOfList={widgetAtTopOfList}
          widgetAtBottomOfList={widgetAtBottomOfList}
        />
      );
    });

    return (
      <FlipMove>
        {widgetContainers}

        {/* Widget Store Button */}
        <p className="lead mt-5 mb-5">
          Want more widgets? Visit the&nbsp;
          <button
            type="button"
            className="btn btn-light border"
            aria-label="open Widget Store"
            onClick={onOpenWidgetStore}
          >
            <FontAwesomeIcon
              icon={faStore}
              className="mr-1"
            />
            Widget Store
          </button>
        </p>
      </FlipMove>
    );
  }
}

Dashboard.propTypes = {
  // Pairs of widgets and their configurations
  widgetPairs: PropTypes.arrayOf(PropTypes.shape({
    // The widget
    widget: Widget.isRequired,
    // The configuration
    configuration: PropTypes.objectOf(PropTypes.any).isRequired,
  })).isRequired,
  /**
   * Open a widget's configuration panel
   * @param {string} id - the id of the widget
   */
  onOpenConfiguration: PropTypes.func.isRequired,
  /**
   * Open a widget's help panel
   * @param {string} id - the id of the widget
   */
  onOpenHelp: PropTypes.func.isRequired,
  /**
   * Change a widget's configuration
   * @param {string} id - the id of the widget
   * @param {object} newConfiguration - the new config
   */
  onChangeConfiguration: PropTypes.func.isRequired,
  /**
   * Move the position of a widget by one
   * @param {string} id - the id of the widget to move
   * @param {boolean} up - if true, move the widget up once, if false, move it
   *   down once
   */
  onMoveWidget: PropTypes.func.isRequired,
  /**
   * Remove a widget
   * @param {string} id - the id of the widget to remove
   */
  onRemoveWidget: PropTypes.func.isRequired,
  /**
   * Open the widget store
   */
  onOpenWidgetStore: PropTypes.func.isRequired,
};

export default Dashboard;
