import GradeStats from './GradeStats';
import AttemptsWidget from './AttemptsWidget';
import GradeHistogram from './GradeHistogram';

// Import helpers
import preprocessWidget from '../helpers/preprocessWidget';

// Put all widgets in a list
const widgetList = [
  GradeStats,
  AttemptsWidget,
  GradeHistogram,
];

// Convert to map
const idToWidget = {}; // id => widget
widgetList.forEach((widget) => {
  const { id } = widget;
  idToWidget[id] = preprocessWidget(widget);
});

export default idToWidget;
