/**
 * Content for the GraderCommentsImpact widget
 * @author Grace Whitney
 */

// Import React 
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components 
import BarChart from '../../shared/charts/BarChart';
import PieChart from '../../shared/charts/PieChart';

// Import data
import getCanvasData from '../../helpers/getCanvasData';

/* ---------------------------- Class --------------------------- */

class GraderCommentsImpactContent extends Component {
  constructor(props) {
    super(props);


  }
}

GraderCommentsImpactContent.propTypes = {
  /**
   * Handler for setting the list of actions in the action bar
   * @param {Action[]} actions - list of actions
   */
  setActions: PropTypes.func.isRequired,
}

export default GraderCommentsImpactContent;
