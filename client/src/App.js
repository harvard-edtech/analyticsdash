/**
 * Outer-wrapper of the dashboard
 * @author Gabe Abrams
 */

// Import caccl
import initCACCL from 'caccl/client/cached';

// Import React
import React, { Component } from 'react';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';

// Import shared components
import LoadingSpinner from './shared/LoadingSpinner';
import Header from './shared/Header';
import Modal from './shared/Modal';
import MiniWidgetTitle from './shared/MiniWidgetTitle';
import StudentIntroduction from './shared/StudentIntroduction';

// Import helpers
import getCanvasData from './helpers/getCanvasData';

// Import constants
import METADATA_ID from './constants/METADATA_ID';
import DEFAULT_SETUP from './constants/DEFAULT_SETUP';

// Import widgets
import idToWidget from './widgets/idToWidget';

// Import other components
import Dashboard from './Dashboard';
import ConfigurePanel from './ConfigurePanel';
import HelpPanel from './HelpPanel';
import WidgetStore from './WidgetStore';

// Import resources
import './App.css';

/* ----------------------- Initialization ----------------------- */

// Initialize caccl
const { api, getStatus } = initCACCL();

/* -------------------------- Constants ------------------------- */

const MIN_INTRODUCTION_MS = 3000;

const VIEWS = {
  DASHBOARD: 'dashboard',
  WIDGET_STORE: 'widget-store',
  CONFIGURE_WIDGET: 'configure-widget',
  WIDGET_HELP: 'widget-help',
  CONFIRM_REMOVE_WIDGET: 'confirm-remove-widget',
  WIDGET_INITIAL_CONFIGURE: 'initial-configure',
  WIDGET_INSTALL_SUCCESS: 'widget-install-success',
};

/* ---------------------------- Class --------------------------- */

class App extends Component {
  /**
   * Initialize App component
   * @author Gabe Abrams
   */
  constructor(props) {
    super(props);

    // Set up state
    this.state = {
      // True if loading
      loading: true,
      // Fatal error message
      fatalErrorMessage: null,
      // The id of the course
      courseId: null,
      // Current view
      currentView: VIEWS.DASHBOARD,
      // The id of the current widget that's being customized, edited, etc.
      selectedWidgetId: null,
      // Current configuration map
      configMap: {}, // id => configuration
      // Current order of widgets
      widgetOrder: [], // id[]
      // Student to introduce
      studentToIntroduce: null,
    };
  }

  /**
   * Called when the component mounted, pulls state and user profile from server
   * @author Gabe Abrams
   */
  async componentDidMount() {
    // Load status
    let launchInfo;
    try {
      // Get status from server
      const status = await getStatus();

      // > App wasn't launched via Canvas
      if (!status.launched) {
        return this.setState({
          fatalErrorMessage: 'Please launch this app from Canvas.',
        });
      }

      // > App is not authorized
      if (!status.authorized) {
        return this.setState({
          fatalErrorMessage: 'We don\'t have access to Canvas. Please re-launch the app.',
        });
      }

      // Save launch info
      ({ launchInfo } = status);
    } catch (err) {
      return this.setState({
        fatalErrorMessage: `Error while requesting state from server: ${err.message}`,
      });
    }

    // Extract launch info
    const { courseId } = launchInfo;

    // Load metadata
    let configMap;
    let widgetOrder;
    let students;
    try {
      const [
        metadata,
        allStudents,
      ] = await Promise.all([
        api.course.app.getMetadata({
          courseId,
          metadata_id: METADATA_ID.value,
        }),
        api.course.listStudents({
          courseId,
          includeAvatar: true,
          activeOnly: true,
          includeEmail: true,
        }),
      ]);

      // Save students
      students = allStudents;

      // Extract widget map out of the metadata
      configMap = metadata.config_map;
      widgetOrder = metadata.widget_order;

      // Use default configMap if one isn't set up yet
      if (configMap === undefined || configMap === null) {
        ({ configMap } = DEFAULT_SETUP);
      }

      // Use default widgetOrder if one isn't set up yet
      if (widgetOrder === undefined || widgetOrder === null) {
        ({ widgetOrder } = DEFAULT_SETUP);
      }

      // Remove widgets that no longer exist
      widgetOrder = widgetOrder.filter((widgetId) => {
        return idToWidget[widgetId];
      });
    } catch (err) {
      return this.setState({
        fatalErrorMessage: err.message,
      });
    }

    // Introduce student
    this.setState({
      studentToIntroduce: students[Math.floor(Math.random() * students.length)]
    });

    // Wait for data to load
    const canvasData = getCanvasData(courseId);
    await Promise.all([
      canvasData.loadData(students),
      // Also make sure that a minimum amount of time has passed so the
      // user has time to read the intro
      new Promise((r) => { setTimeout(r, MIN_INTRODUCTION_MS); }),
    ]);

    // Save to state
    this.setState({
      courseId,
      configMap,
      widgetOrder,
      loading: false,
      studentToIntroduce: null,
    });
  }

  /**
   * Update a tool's configuration
   * @author Gabe Abrams
   * @param {string} id - the id of the widget
   * @param {object} newConfiguration - the new configuration
   */
  async onChangeConfiguration(id, newConfiguration) {
    // Update the configMap
    const { configMap } = this.state;
    configMap[id] = newConfiguration;

    // Save state
    await new Promise((r) => {
      this.setState({ configMap }, r);
    });

    // Save to Canvas
    await this.save();
  }

  /**
   * Save the metadata to Canvas
   * @author Gabe Abrams
   */
  async save() {
    const {
      configMap,
      widgetOrder,
      courseId,
    } = this.state;

    // Start loading
    this.setState({
      loading: true,
    });

    // Build the metadata
    const metadata = {
      config_map: configMap,
      widget_order: widgetOrder,
    };

    // Save to Canvas
    try {
      await api.course.app.updateMetadata({
        courseId,
        metadata,
        metadata_id: METADATA_ID.value,
      });

      // Stop loading
      this.setState({
        loading: false,
      });
    } catch (err) {
      this.setState({
        fatalErrorMessage: `Your dashboard setup could not be saved because an error occurred: ${err.message}`,
      });
    }
  }

  /**
   * Remove the selected widget from this dashboard
   * @author Gabe Abrams
   */
  async removeWidget() {
    const {
      widgetOrder,
      configMap,
      selectedWidgetId,
    } = this.state;

    // Filter the widgets
    const newWidgetOrder = widgetOrder.filter((id) => {
      return (id !== selectedWidgetId);
    });

    // Remove the configuration
    delete configMap[selectedWidgetId];

    // Save state
    await new Promise((r) => {
      this.setState({
        configMap,
        widgetOrder: newWidgetOrder,
        // Go back to dashboard
        currentView: VIEWS.DASHBOARD,
        selectedWidgetId: null,
      }, r);
    });

    // Save to Canvas
    return this.save();
  }

  /**
   * Add a widget to the user's list
   * @author Gabe Abrams
   * @param {string} id - the id of the widget to add
   */
  async addWidget(id) {
    // Add the widget to the top of the dashboard
    const { widgetOrder } = this.state;
    widgetOrder.unshift(id);

    // Save state
    await new Promise((r) => {
      this.setState({
        widgetOrder,
        currentView: VIEWS.WIDGET_INSTALL_SUCCESS,
        selectedWidgetId: id,
      }, r);
    });

    // Save to Canvas
    await this.save();
  }

  /**
   * Render the App
   * @author Gabe Abrams
   */
  render() {
    // Deconstruct the state
    const {
      loading,
      fatalErrorMessage,
      currentView,
      configMap,
      widgetOrder,
      selectedWidgetId,
      studentToIntroduce,
    } = this.state;

    let modal;

    /* ---------------------------- Error --------------------------- */
    if (fatalErrorMessage) {
      return (
        <div className="text-center">
          <div className="alert alert-warning m-4 d-inline-block">
            <h3>
              Oops! An error occurred:
            </h3>
            {fatalErrorMessage}
          </div>
        </div>
      );
    }

    /* --------------------------- Loading -------------------------- */

    if (studentToIntroduce) {
      modal = (
        <Modal
          noHeader
          body={(
            <StudentIntroduction
              student={studentToIntroduce}
            />
          )}
          type={loading ? Modal.TYPES.BLOCKED : Modal.TYPES.NO_BUTTONS}
          onClose={() => {
            this.setState({
              studentToIntroduce: null,
            });
          }}
        />
      );
    }

    if (loading) {
      return (
        <div>
          {modal}
          <LoadingSpinner key="loader" />
        </div>
      );
    }

    /* ---------------------------- Modal --------------------------- */

    if (
      currentView === VIEWS.CONFIGURE_WIDGET
      || currentView === VIEWS.WIDGET_INITIAL_CONFIGURE
    ) {
      // Get previous configuration
      const previousConfiguration = (
        currentView === VIEWS.WIDGET_INITIAL_CONFIGURE
          ? idToWidget[selectedWidgetId].initialConfiguration || {}
          : configMap[selectedWidgetId]
      );

      // Configure
      modal = (
        <ConfigurePanel
          widget={idToWidget[selectedWidgetId]}
          previousConfiguration={previousConfiguration}
          doingInitialConfig={currentView === VIEWS.WIDGET_INITIAL_CONFIGURE}
          onDone={async (newConfiguration) => {
            // Save the configuration
            if (newConfiguration) {
              await this.onChangeConfiguration(
                selectedWidgetId,
                newConfiguration
              );
            }

            // Change back to previous view
            if (currentView === VIEWS.WIDGET_INITIAL_CONFIGURE) {
              // Add the widget
              this.addWidget(selectedWidgetId);
            } else {
              // Go back to dashboard
              this.setState({
                selectedWidgetId: null,
                currentView: VIEWS.DASHBOARD,
              });
            }
          }}
        />
      );
    } else if (currentView === VIEWS.WIDGET_HELP) {
      modal = (
        <HelpPanel
          widget={idToWidget[selectedWidgetId]}
          configuration={configMap[selectedWidgetId]}
          onChangeConfiguration={async (id, newConfiguration) => {
            await this.onChangeConfiguration(id, newConfiguration);
          }}
          onOpenConfiguration={() => {
            this.setState({
              currentView: VIEWS.CONFIGURE_WIDGET,
            });
          }}
          onDone={() => {
            this.setState({
              selectedWidgetId: null,
              currentView: VIEWS.DASHBOARD,
            });
          }}
        />
      );
    } else if (currentView === VIEWS.CONFIRM_REMOVE_WIDGET) {
      const widgetToRemove = idToWidget[selectedWidgetId];
      const configurationChanged = (
        widgetToRemove.configurable
        && (
          JSON.stringify(widgetToRemove.initialConfiguration || {})
          !== JSON.stringify(configMap[selectedWidgetId] || {})
        )
      );
      const modalBody = (
        configurationChanged
          ? 'You will lose your customization of this widget, but you can always add the widget again in the Widget Store.'
          : 'You can always add this widget again in the Widget Store.'
      );
      modal = (
        <Modal
          title="Are you sure?"
          body={modalBody}
          type={Modal.TYPES.OKAY_CANCEL}
          okayLabel="Remove Widget"
          okayColor="warning"
          onClose={(button) => {
            if (button === Modal.BUTTONS.OKAY) {
              // Confirmed
              return this.removeWidget();
            }

            // Not confirmed. Close modal
            this.setState({
              currentView: VIEWS.DASHBOARD,
              selectedWidgetId: null,
            });
          }}
        />
      );
    } else if (currentView === VIEWS.WIDGET_INSTALL_SUCCESS) {
      modal = (
        <Modal
          title={(
            <span>
              <MiniWidgetTitle widget={idToWidget[selectedWidgetId]} />
              &nbsp;Added Successfully
            </span>
          )}
          body="You can find it at the top of your dashboard."
          type={Modal.TYPES.OKAY}
          onClose={() => {
            this.setState({
              selectedWidgetId: null,
              currentView: VIEWS.DASHBOARD,
            });
          }}
        />
      );
    }

    /* ---------------------------- Body ---------------------------- */
    let body;

    const bodyIsStore = (
      currentView === VIEWS.WIDGET_STORE
      || currentView === VIEWS.WIDGET_INITIAL_CONFIGURE
    );

    if (bodyIsStore) {
      body = (
        <WidgetStore
          installedWidgetIds={widgetOrder}
          onAddWidget={async (id) => {
            // Check if no configuration needed
            if (!idToWidget[id].configureOnAdd) {
              // Add it to the list with its initial configuration
              await this.onChangeConfiguration(
                id,
                idToWidget[id].initialConfiguration
              );
              return this.addWidget(id);
            }

            // Perform initial configuration and add it after
            this.setState({
              selectedWidgetId: id,
              currentView: VIEWS.WIDGET_INITIAL_CONFIGURE,
            });
          }}
          onOpenDashboard={() => {
            this.setState({
              currentView: VIEWS.DASHBOARD,
            });
          }}
        />
      );
    }

    // Dashboard (show if another body is not set)
    const widgetPairs = widgetOrder.map((id) => {
      const configuration = configMap[id] || {};
      const widget = idToWidget[id];

      return {
        widget,
        configuration,
      };
    });
    // Hide dashboard but keep it initialized so customization
    //   is not lost while navigating away
    const dashboard = (
      <div className={body ? 'd-none' : ''}>
        <Dashboard
          key="dashboard"
          widgetPairs={widgetPairs}
          onOpenConfiguration={(id) => {
            this.setState({
              currentView: VIEWS.CONFIGURE_WIDGET,
              selectedWidgetId: id,
            });
          }}
          onOpenHelp={(id) => {
            this.setState({
              currentView: VIEWS.WIDGET_HELP,
              selectedWidgetId: id,
            });
          }}
          onChangeConfiguration={async (id, newConfiguration) => {
            await this.onChangeConfiguration(id, newConfiguration);
          }}
          onMoveWidget={(id, up) => {
            // Update the widgetOrder
            for (let i = 0; i < widgetOrder.length; i++) {
              // Get widget at current index
              const curr = widgetOrder[i];

              // Check if this is the widget
              if (curr === id) {
                // Found the widget! Now swap it in the order
                if (up) {
                  // Move up (swap with previous)
                  widgetOrder[i] = widgetOrder[i - 1];
                  widgetOrder[i - 1] = curr;
                } else {
                  // Move down (swap with next)
                  widgetOrder[i] = widgetOrder[i + 1];
                  widgetOrder[i + 1] = curr;
                }

                break;
              }
            }

            // Update the state
            this.setState({ widgetOrder });
          }}
          onRemoveWidget={(id) => {
            this.setState({
              currentView: VIEWS.CONFIRM_REMOVE_WIDGET,
              selectedWidgetId: id,
            });
          }}
          onOpenWidgetStore={() => {
            this.setState({
              currentView: VIEWS.WIDGET_STORE,
            });
          }}
        />
      </div>
    );

    /* --------------------------- Header --------------------------- */

    // Header addon text
    let headerTextAddon = 'Dashboard';
    if (bodyIsStore) {
      headerTextAddon = 'Widget Store';
    }

    // Left button
    let leftButton;
    if (currentView === VIEWS.WIDGET_STORE) {
      leftButton = {
        contents: 'Back to Dashboard',
        onClick: () => {
          this.setState({
            currentView: VIEWS.DASHBOARD,
          });
        },
      };
    }

    // Right button
    let rightButton;
    if (currentView === VIEWS.DASHBOARD) {
      rightButton = {
        contents: (
          <span>
            <FontAwesomeIcon
              icon={faStore}
              className="mr-1"
            />
            Widget Store
          </span>
        ),
        onClick: () => {
          this.setState({
            currentView: VIEWS.WIDGET_STORE,
          });
        },
      };
    }

    /* -------------------- Assemble into One UI -------------------- */
    return (
      <div className="content-container">
        {/* Modal */}
        {modal}

        {/* Header */}
        <Header
          addon={headerTextAddon}
          leftButton={leftButton}
          rightButton={rightButton}
        />

        {/* Content */}
        <div className="content-below-header text-center">
          {body}
          {dashboard}
        </div>
      </div>
    );
  }
}

export default App;
