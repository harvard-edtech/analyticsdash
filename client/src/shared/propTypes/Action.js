import PropTypes from 'prop-types';

/**
 * An action bar button item
 * @author Grace Whitney
 */
export default PropTypes.shape({
  // Unique key for the action button
  key: PropTypes.string.isRequired,
  // Id for the action button
  id: PropTypes.string.isRequired,
  // Label for the action button
  label: PropTypes.string.isRequired,
  // Description of the action that will be taken
  description: PropTypes.string.isRequired,
  /**
   * Handler function for the action
   */
  onClick: PropTypes.func.isRequired,
});
