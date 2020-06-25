/**
 * Page for help on a widget
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared propTypes
import Widget from './shared/propTypes/Widget';

// Import shared components
import Modal from './shared/Modal';
import MiniWidgetTitle from './shared/MiniWidgetTitle';

class HelpPanel extends Component {
  /**
   * Render HelpPanel
   * @author Gabe Abrams
   */
  render() {
    const {
      widget,
      configuration,
      onChangeConfiguration,
      onOpenConfiguration,
      onDone,
    } = this.props;

    // Get widget configuration panel
    const { HelpComponent } = widget;

    return (
      <Modal
        title={(
          <span>
            Help for&nbsp;
            <MiniWidgetTitle widget={widget} />
          </span>
        )}
        type={Modal.TYPES.NO_BUTTONS}
        onClose={onDone}
        body={(
          <HelpComponent
            widget={widget}
            configuration={configuration}
            onChangeConfiguration={onChangeConfiguration}
            onOpenConfiguration={onOpenConfiguration}
          />
        )}
      />
    );
  }
}

HelpPanel.propTypes = {
  // The widget being configured
  widget: Widget.isRequired,
  // The configuration of the widget
  configuration: PropTypes.objectOf(PropTypes.any).isRequired,
  /**
   * Handler to call when the user edits the configuration
   * @param {object} newConfiguration - the new config
   */
  onChangeConfiguration: PropTypes.func.isRequired,
  /**
   * Handler to call when user opens the configuration panel
   */
  onOpenConfiguration: PropTypes.func.isRequired,
  /**
   * Handler to call when the user is done with the help panel
   */
  onDone: PropTypes.func.isRequired,
};

export default HelpPanel;
