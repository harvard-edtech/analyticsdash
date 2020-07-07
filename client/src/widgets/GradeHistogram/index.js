// Import components
import ContentComponent from './ContentComponent';
import ConfigurationComponent from './ConfigurationComponent';
import HelpComponent from './HelpComponent';

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
  ConfigurationComponent,
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
