// Import components
import ContentComponent from './GradingProgressContent';
import HelpComponent from './GradingProgressHelp';

// Import icon
import icon from './icon.png';

// Import requirement types
import REQUIREMENTS from '../../constants/REQUIREMENTS';

export default {
  id: 'grading-progress',

  ContentComponent,
  HelpComponent,

  requirements: [
    // REQUIREMENTS.AT_LEAST_ONE_SUBMITTED_ASSIGNMENT,
  ],

  metadata: {
    icon,
    title: 'Grading Progress',
    subtitle: 'Progress bars for assignment grading',
    description: 'Visualizations of graders\' progress on each assignment and rubric item.',
  },
};
