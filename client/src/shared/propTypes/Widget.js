import PropTypes from 'prop-types';

// Component PropType
import Comp from './Comp';

// Types of requirements
import REQUIREMENTS from '../../constants/REQUIREMENTS';

/**
 * PropType for a Widget
 * @author Gabe Abrams
 */
export default PropTypes.shape({
  // Unique ID for the widget
  id: PropTypes.string.isRequired,

  // True if widget is configurable
  configurable: PropTypes.boolean,
  // True if widget must be configured when it is added
  configureOnAdd: PropTypes.boolean,
  // Initial configuration to start with
  initialConfiguration: PropTypes.objectOf(PropTypes.any),

  // List of requirements for the widget to be shown
  requirements: PropTypes.arrayOf(PropTypes.oneOf([
    REQUIREMENTS.AT_LEAST_ONE_GRADED_ASSIGNMENT,
    REQUIREMENTS.AT_LEAST_ONE_SUBMITTED_ASSIGNMENT,
  ])),

  // View (component) for the widget itself
  // May accept the following propTypes:
  // - widget
  // - configuration [object]
  // - onOpenConfiguration() [function]
  // - onOpenHelp() [function]
  // - onChangeConfiguration(newConfiguration) [function]
  ContentComponent: Comp.isRequired,

  // View (component) for configuration
  // May accept the following propTypes:
  // - widget
  // - configuration [object]
  // - onChangeConfiguration(newConfiguration) [function]
  ConfigurationComponent: Comp, // Required if configurable

  // View (component) for help
  // May accept the following propTypes:
  // - widget
  // - configuration [object]
  // - onOpenConfiguration() [function]
  // - onChangeConfiguration(newConfiguration) [function]
  HelpComponent: Comp, // If excluded, no help option

  // Metadata
  metadata: PropTypes.shape({
    // Title of the app (human-readable)
    title: PropTypes.string.isRequired,
    // Subtitle of the app (human-readable)
    subtitle: PropTypes.string.isRequired,
    // Description of the app (human-readable)
    description: PropTypes.string.isRequired,
    // Image icon of the app
    icon: PropTypes.string.isRequired,
  }).isRequired,
});
