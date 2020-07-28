/**
 * Configuration panel content for the GradeHistogram component
 * @author Grace Whitney
 */

import React, { Component } from 'react';

/* ---------------------------- Class --------------------------- */
class GradeHistogramHelpComponent extends Component {
  /**
   * Render GradeHistogramHelp
   * @author Grace Whitney
   */
  render() {
    return (
      <div>
        This widget provides a histogram representing the distribution of
        assignment grades. You can change the number of histogram buckets from
        the edit menu.
      </div>
    );
  }
}

export default GradeHistogramHelpComponent;
