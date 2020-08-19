import GradeStats from './GradeStats';
import AttemptsWidget from './AttemptsWidget';
import GradeHistogram from './GradeHistogram';
import GraderCommentsImpact from './GraderCommentsImpact';

// Import helpers
import preprocessWidget from '../helpers/preprocessWidget';

// Put all widgets in a list
const widgetList = [
  GradeStats,
  AttemptsWidget,
  GradeHistogram,
  GraderCommentsImpact,
];

// Convert to map
const idToWidget = {}; // id => widget
widgetList.forEach((widget) => {
  const { id } = widget;
  idToWidget[id] = preprocessWidget(widget);
});

export default idToWidget;
