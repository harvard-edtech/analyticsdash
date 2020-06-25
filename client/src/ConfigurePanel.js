/**
 * Page for configuring a widget
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';

// Import shared propTypes
import Widget from './shared/propTypes/Widget';

// Import shared components
import Modal from './shared/Modal';
import MiniWidgetTitle from './shared/MiniWidgetTitle';

class ConfigurePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // The current configuration
      configuration: props.previousConfiguration,
      // True if confirming cancel
      confirmingCancel: false,
    };
  }

  /**
   * Check if the configuration has changed
   * @author Gabe Abrams
   */
  configHasChanged() {
    const { previousConfiguration } = this.props;
    const { configuration } = this.state;

    return (
      JSON.stringify(previousConfiguration)
      !== JSON.stringify(configuration)
    );
  }

  /**
   * Render ConfigurePanel
   * @author Gabe Abrams
   */
  render() {
    const {
      widget,
      onDone,
      doingInitialConfig,
    } = this.props;
    const {
      configuration,
      confirmingCancel,
    } = this.state;

    /* --------------------- Confirmation View ---------------------- */

    if (confirmingCancel) {
      return (
        <Modal
          title="Abandon changes?"
          body="Are you sure you want to abandon your changes?"
          type={Modal.TYPES.OKAY_CANCEL}
          okayLabel="Abandon Changes"
          okayColor="warning"
          onDone={(button) => {
            if (button === Modal.BUTTONS.OKAY) {
              // Confirmed
              return onDone();
            }

            // Did not confirm
            this.setState({
              confirmingCancel: false,
            });
          }}
        />
      );
    }

    /* --------------------- Configuration View --------------------- */

    // Get widget configuration panel
    const { ConfigureComponent } = widget;

    return (
      <Modal
        title={(
          <span>
            Configure&nbsp;
            <MiniWidgetTitle widget={widget} />
          </span>
        )}
        type={Modal.TYPES.NO_BUTTONS_AND_BLOCKED}
        body={(
          <div>
            <ConfigureComponent
              widget={widget}
              configuration={configuration}
              onChangeConfiguration={(newConfiguration) => {
                this.setState({
                  configuration: newConfiguration,
                });
              }}
            />

            {/* Footer Buttons */}
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-info btn-lg mr-2"
                aria-label={(
                  doingInitialConfig
                    ? 'add widget'
                    : 'save changes to widget configuration'
                )}
                onClick={() => {
                  onDone(configuration);
                }}
              >
                <FontAwesomeIcon
                  icon={doingInitialConfig ? faPlus : faSave}
                  className="mr-2"
                />
                {
                  doingInitialConfig
                    ? 'Add Widget'
                    : 'Save Changes'
                }
              </button>
              {!doingInitialConfig && (
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  aria-label="remove widget from dashboard"
                  title="Remove Widget from Dashboard"
                  onClick={() => {
                    if (!this.configHasChanged()) {
                      // Immediately return (no changes have occurred)
                      return onDone();
                    }

                    // Ask user to confirm
                    this.setState({
                      confirmingCancel: true,
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      />
    );
  }
}

ConfigurePanel.propTypes = {
  // The widget being configured
  widget: Widget.isRequired,
  // The initial state of the configuration of the widget
  previousConfiguration: PropTypes.objectOf(PropTypes.any).isRequired,
  // If true, use must save and cannot cancel
  doingInitialConfig: PropTypes.bool.isRequired,
  /**
   * Handler to call when the user is done editing the configuration
   * @param {object} [newConfiguration] - the new config
   */
  onDone: PropTypes.func.isRequired,
};

export default ConfigurePanel;
