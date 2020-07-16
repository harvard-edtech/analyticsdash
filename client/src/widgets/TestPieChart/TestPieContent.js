/**
 * Content for the TestPieChart component
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';

// Import shared pie chart
import PieChart from '../../shared/charts/PieChart';

class PieChartContent extends Component {
  render() {
    return (
      <PieChart
        title="Test Pie Chart"
        segments={[
          {
            label: 'Segment 1',
            value: 30,
          },
          {
            label: 'Segment 2',
            value: 60,
          },
          {
            label: 'Segment 3',
            value: 5,
          },
          {
            label: 'Segment 4',
            value: 40,
          },
        ]}
        seriesLabelType="outer"
        showSegmentValues
      />
    );
  }
}

export default PieChartContent;
