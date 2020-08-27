/**
 * Container for a widget
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faChevronUp,
  faChevronDown,
  faEllipsisH,
  faInfoCircle,
  faTimes,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';

// Import shared propTypes
import Widget from '../../shared/propTypes/Widget';

// Import subcomponents 
import ActionBar from './ActionBar';

// Import helpers
import checkRequirements from '../helpers/checkRequirements';
import actionsHaveChanged from '../helpers/actionsHaveChanged';

// CSS
import './index.css';

class WidgetContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // True if dropdown is expanded
      dropdownExpanded: false,
      // Actions to be displayed by the action bar
      actions: null,
    };
  }

  /**
   * Render WidgetContainer
   * @author Gabe Abrams
   */
  render() {
    const {
      widget,
      configuration,
      onOpenConfiguration,
      onOpenHelp,
      onChangeConfiguration,
      onMoveWidgetUp,
      onMoveWidgetDown,
      onRemoveWidget,
      widgetAtTopOfList,
      widgetAtBottomOfList,
    } = this.props;
    const {
      dropdownExpanded,
      actions,
    } = this.state;

    // Get the contents of the widget
    const { ContentComponent } = widget;

    // Create buttons
    const buttons = [];
    // > Move Up
    buttons.push(
      <button
        key="move-up"
        type="button"
        className="btn btn-secondary pl-2 pr-2 ml-1 WidgetContainer-button"
        aria-label={`move the "${widget.metadata.title}" widget up in the dashboard`}
        onClick={onMoveWidgetUp}
        title={(
          widgetAtTopOfList
            ? 'Disabled: Widget Already at the Top'
            : 'Move Widget Up in Dashboard'
        )}
        disabled={widgetAtTopOfList}
      >
        <FontAwesomeIcon icon={faChevronUp} />
      </button>
    );
    // > Move Down
    buttons.push(
      <button
        key="move-down"
        type="button"
        className="btn btn-secondary pl-2 pr-2 ml-1 WidgetContainer-button"
        aria-label={`move the "${widget.metadata.title}" widget down in the dashboard`}
        onClick={onMoveWidgetDown}
        title={(
          widgetAtBottomOfList
            ? 'Disabled: Widget Already at the Bottom'
            : 'Move Widget Down in Dashboard'
        )}
        disabled={widgetAtBottomOfList}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    );
    // > Dropdown
    buttons.push(
      <div
        key="dropdown"
        className="dropdown d-inline-block ml-1"
      >
        <button
          type="button"
          className="btn btn-secondary"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded={dropdownExpanded}
          onClick={() => {
            this.setState({
              dropdownExpanded: !dropdownExpanded,
            });
          }}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
        <div
          className={`dropdown-menu${dropdownExpanded ? ' show' : ''} dropdown-menu-right`}
        >
          {widget.HelpComponent && (
            <button
              type="button"
              className="dropdown-item btn-light"
              aria-label={`get help and info on the "${widget.metadata.title}" widget`}
              onClick={onOpenHelp}
            >
              <span className="WidgetContainer-icon-container">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="mr-2"
                />
              </span>
              Help &amp; Info
            </button>
          )}
          {widget.configurable && (
            <button
              type="button"
              className="dropdown-item btn-light"
              aria-label={`edit the "${widget.metadata.title}" widget`}
              onClick={onOpenConfiguration}
            >
              <span className="WidgetContainer-icon-container">
                <FontAwesomeIcon
                  icon={faCog}
                  className="mr-2"
                />
              </span>
              Edit Widget
            </button>
          )}
          <button
            type="button"
            className="dropdown-item btn-light"
            aria-label={`remove the "${widget.metadata.title}" widget`}
            onClick={onRemoveWidget}
          >
            <span className="WidgetContainer-icon-container">
              <FontAwesomeIcon
                icon={faTimes}
                className="mr-2"
              />
            </span>
            Remove Widget
          </button>
        </div>
      </div>
    );

    /* --------------------------- Content -------------------------- */

    const requirementsErrorMessage = checkRequirements(widget.requirements);

    const content = (
      requirementsErrorMessage
        ? (
          <div className="text-info p-3">
            <FontAwesomeIcon
              icon={faHourglassHalf}
              className="mr-2"
            />
            {requirementsErrorMessage}
          </div>
        )
        : (
          <ContentComponent
            widget={widget}
            configuration={configuration}
            onOpenConfiguration={onOpenConfiguration}
            onOpenHelp={onOpenHelp}
            onChangeConfiguration={onChangeConfiguration}
            setActions={(newActions) => {
              if (actionsHaveChanged(actions, newActions)) {
                this.setState({ actions: newActions });
              }
            }}
          />
        )
    );

    /* -------------------------- Action Bar ------------------------ */

    const actionBar = (
      <ActionBar
        actions={actions}
        widget={widget}
      />
    );

    /* --------------------------- Full UI -------------------------- */

    return (
      <div className="alert alert-info p-2">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-center mb-2">
          {/* Icon */}
          <div
            className="mr-1"
            style={{ width: '35px', height: '35px' }}
          >
            <img
              src={widget.metadata.icon}
              className="w-100 h-100"
              aria-label={`icon for widget ${widget.metadata.title}`}
            />
          </div>

          {/*  Title */}
          <div className="flex-grow-1">
            <h3 className="text-left m-0">
              {widget.metadata.title}
            </h3>
          </div>

          {/* Buttons */}
          <div>
            {buttons}
          </div>
        </div>

        {/* Contents */}
        <div className="alert alert-light text-dark m-0 p-2">
          {content}
        </div>

        {/* Action Bar */}
        <div className="mt-2">
          {actionBar}
        </div>
      </div>
    );
  }
}

WidgetContainer.propTypes = {
  // The widget to show
  widget: Widget.isRequired,
  // Configuration for the widget
  configuration: PropTypes.objectOf(PropTypes.any).isRequired,
  /**
   * Open a widget's configuration panel
   */
  onOpenConfiguration: PropTypes.func.isRequired,
  /**
   * Open a widget's help panel
   */
  onOpenHelp: PropTypes.func.isRequired,
  /**
   * Change a widget's configuration
   * @param {object} newConfiguration - the new config
   */
  onChangeConfiguration: PropTypes.func.isRequired,
  /**
   * Move the position of a widget up by one
   */
  onMoveWidgetUp: PropTypes.func.isRequired,
  /**
   * Move the position of a widget down by one
   */
  onMoveWidgetDown: PropTypes.func.isRequired,
  /**
   * Remove the widget from this dashboard
   */
  onRemoveWidget: PropTypes.func.isRequired,
  // If true, this widget is at the top of the list
  widgetAtTopOfList: PropTypes.bool.isRequired,
  // If true, this widget is at the bottom of the list
  widgetAtBottomOfList: PropTypes.bool.isRequired,
};

export default WidgetContainer;
