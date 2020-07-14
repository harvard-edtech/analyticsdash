// Import components
import ContentComponent from './AttemptsContentComponent';
import HelpComponent from './AttemptsHelpComponent';

// Import icon
import icon from './icon.png';

export default {
  id: 'attempts',

  ContentComponent,
  HelpComponent,

  metadata: {
    icon,
    title: 'Attempts',
    subtitle: 'Attempt history for submitted assignments',
    description: 'Shows how many attempts students used to submit an assignment',
  },
};
