// Import components
import ContentComponent from './GradeHistogramContentComponent';
import ConfigureComponent from './GradeHistogramConfigurationComponent';
import HelpComponent from './GradeHistogramHelpComponent';

// Import icon
import icon from './icon.png';

// Import requirement types
import REQUIREMENTS from '../../constants/REQUIREMENTS';

export default {
  id: 'gradehistogram',

  configurable: true,
  initialConfiguration: {
    nBuckets: 10, // number of histogram buckets
  },

  ContentComponent,
  ConfigureComponent,
  HelpComponent,

  requirements: [
    REQUIREMENTS.AT_LEAST_ONE_GRADED_ASSIGNMENT,
  ],

  metadata: {
    icon,
    title: 'Grade Distribution',
    subtitle: 'Histograms showing the distribution of graded assignments',
    description: 'This tool provides a histogram of the grade distribution for each graded assignment.',
  },
};
