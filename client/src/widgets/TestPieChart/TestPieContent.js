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
        segments={[
          {
            label: 'Apple',
            value: 30,
          },
          {
            label: 'Blueberry',
            value: 60,
          },
          {
            label: 'Mango',
            value: 5,
          },
          {
            label: 'Pineapple',
            value: 40,
          },
          {
            label: 'Peach',
            value: 22,
          },
          {
            label: 'Strawberry',
            value: 50,
          },
          {
            label: 'Apricot',
            value: 31,
          },
          {
            label: 'Pomegranate',
            value: 10,
          },
          {
            label: 'Kiwi',
            value: 20,
          },
          {
            label: 'Banana',
            value: 30,
          },
        ]}
        showSegmentLabels
        showLegend
      />
      </div>
    );
  }
}

export default PieChartContent;
