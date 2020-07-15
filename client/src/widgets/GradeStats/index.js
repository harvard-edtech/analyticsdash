// Import components
import ContentComponent from './GradeStatsContent';
import HelpComponent from './GradeStatsHelp';

// Import icon
import icon from './icon.png';

// Import requirement types
import REQUIREMENTS from '../../constants/REQUIREMENTS';

export default {
  id: 'gradestats',

  ContentComponent,
  HelpComponent,

  requirements: [
    REQUIREMENTS.AT_LEAST_ONE_GRADED_ASSIGNMENT,
  ],

  metadata: {
    icon,
    title: 'Grade Stats',
    subtitle: 'Mean, median, and standard deviation for graded assignments.',
    description: 'Simple and useful statistics on student grades for assignments in the course. Also, in one click, you can share stats with students via a Canvas announcement.',
  },
};
