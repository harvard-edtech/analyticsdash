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
        seriesLabelType="outer"
        showSegmentValues
        tooltipFormatter={(segment) => {
          return (`${segment.label}: ${segment.value} students`);
        }}
      />
    );
  }
}

export default PieChartContent;
