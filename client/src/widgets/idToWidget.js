import GradeStats from './GradeStats';
import GradeHistogram from './GradeHistogram';
import TestPieChart from './TestPieChart';

// Import helpers
import preprocessWidget from '../helpers/preprocessWidget';

// Put all widgets in a list
const widgetList = [
  GradeStats,
  GradeHistogram,
  TestPieChart,
];

// Convert to map
const idToWidget = {}; // id => widget
widgetList.forEach((widget) => {
  const { id } = widget;
  idToWidget[id] = preprocessWidget(widget);
});

export default idToWidget;
