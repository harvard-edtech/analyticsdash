import React from 'react';

// Import components
import ContentComponent from './ContentComponent';

export default {
  id: 'dummywidget',

  configurable: true,

  ContentComponent: ContentComponent,
  HelpComponent: ContentComponent,
  ConfigureComponent: ContentComponent,

  metadata: {
    title: 'DummyWidget',
    subtitle: 'A test widget that does nothing.',
    description: 'I really don\'t know what to say since this is a really boring tool that really does nothing of interest. You should probably just stop reading.',
    icon: (
      <div
        className="d-inline-block bg-info"
        style={{ width: '50px', height: '50px' }}
      />
    ),
  },
};
