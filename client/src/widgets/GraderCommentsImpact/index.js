// Import components
import ContentComponent from './GraderCommentsImpactContent';
import HelpComponent from './GraderCommentsImpactHelp';

// Import icon
import icon from './icon.png';

export default {
  id: 'graderCommentsImpact',

  ContentComponent,
  HelpComponent,

  metadata: {
    icon,
    title: 'Grader Comments Impact',
    subtitle: 'Student readership and improvement metrics for grader comments',
    description: 'This tool provides summary and detailed data showing which students read greader feedback and how their score improvement compares.',
  },
};
