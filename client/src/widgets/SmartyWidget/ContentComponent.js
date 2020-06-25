/**
 * Dummy content component
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

class ContentComponent extends Component {
  constructor(props) {
    super(props);

    this.id = Math.random();
  }

  /**
   * Render ContentComponent
   * @author Gabe Abrams
   */
  render() {
    return (
      <div>
        ContentComponent still being build!
        {this.id}
      </div>
    );
  }
}

export default ContentComponent;
