// Import components
import ContentComponent from './SubmissionPunctualityContentComponent';
import ConfigureComponent from './SubmissionPunctualityConfigurationComponent';
import HelpComponent from './SubmissionPunctualityHelpComponent';

// Import icon
import icon from './icon.png';

// Import requirement types
import REQUIREMENTS from '../../constants/REQUIREMENTS';

export default {
  id: 'submissionPunctuality',

  configurable: true,
  initialConfiguration: {
    gracePeriod: 0, // grace period (mins) for submission
  },

  ContentComponent,
  ConfigureComponent,
  HelpComponent,

  requirements: [
    REQUIREMENTS.AT_LEAST_ONE_SUBMITTED_ASSIGNMENT,
  ],

  metadata: {
    icon,
    title: 'Submission Punctuality',
    subtitle: 'Submission time info for assignments',
    description: 'This tool has a heatmap showing the time intervals in which students submitted an assignment, as well as information about students who submitted on time, late, or did not submit at all. You can also choose to send a message to late submitters or people who did not submit at all through Canvas.',
  },
};
