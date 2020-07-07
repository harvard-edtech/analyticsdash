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
    description: 'I really don\'t know what to say since this is a really boring tool that really does nothing of interest. You should probably just stop reading.',
  },
};
