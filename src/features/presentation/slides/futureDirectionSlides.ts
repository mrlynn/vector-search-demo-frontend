// src/features/presentation/slides/futureDirectionSlides.ts
import { SlideSection } from '../types/slideTypes';

export const futureDirectionSection: SlideSection = {
  id: 'future',
  title: 'The Road Ahead',
  description: 'Future developments and opportunities',
  duration: 10,
  learningObjectives: [
    'Understand upcoming features',
    'Anticipate future use cases',
    'Prepare for emerging technologies'
  ],
  keyTakeaways: [
    'Vector search is rapidly evolving',
    'New capabilities are coming',
    'Prepare for future integrations'
  ],
  slides: [
    {
      id: 'future-capabilities',
      type: 'text-full',
      title: 'Future Capabilities',
      note: 'LOOKING FORWARD',
      content: `
## Upcoming Features

1. **Enhanced Vector Search**
   - Improved performance
   - More similarity metrics
   - Better scaling capabilities

2. **AI Integration**
   - Deeper LLM integration
   - More embedding models
   - Enhanced context understanding

3. **Developer Experience**
   - Simplified setup
   - Better tooling
   - Enhanced monitoring
      `
    }
  ]
};

export default futureDirectionSection.slides;