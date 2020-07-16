// Test widget for the shared pie chart component

// Import content component
import ContentComponent from './TestPieContent';

// Import icon 
import icon from './pacman.png';

export default {
  id: 'testpiewidget',

  ContentComponent,
  requirements: [],
  metadata: {
    icon,
    title: 'Test Pie Widget',
    subtitle: 'Test widget for the shared pie chart component',
    description: 'This tool generates a pie chart'
  }
}
