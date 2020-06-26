// Import components
import ContentComponent from './ContentComponent';

// Import icon
import icon from './noun_dumb_320267.png';

export default {
  id: 'dummywidget',

  configurable: true,

  ContentComponent: ContentComponent,
  HelpComponent: ContentComponent,
  ConfigureComponent: ContentComponent,

  metadata: {
    icon,
    title: 'DummyWidget',
    subtitle: 'A test widget that does nothing.',
    description: 'I really don\'t know what to say since this is a really boring tool that really does nothing of interest. You should probably just stop reading.',
  },
};
