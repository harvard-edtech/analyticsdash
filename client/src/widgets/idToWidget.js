import GradeStats from './GradeStats';
import SmartyWidget from './SmartyWidget';
import AttemptsWidget from './AttemptsWidget';

// Import helpers
import preprocessWidget from '../helpers/preprocessWidget';

// Put all widgets in a list
const widgetList = [
  GradeStats,
  SmartyWidget,
  AttemptsWidget,
];

// Convert to map
const idToWidget = {}; // id => widget
widgetList.forEach((widget) => {
  const { id } = widget;
  idToWidget[id] = preprocessWidget(widget);
});

export default idToWidget;
