# PhotoLingo - AI Image Recognition

A Next.js application with TensorFlow.js MobileNet integration for AI-powered image recognition and language learning.

## Features

- **AI Image Recognition**: Uses MobileNet v2 for real-time image classification
- **1000+ Categories**: Recognizes objects, animals, vehicles, food, and more
- **Real-time Processing**: Client-side inference for privacy and speed
- **Mobile Optimized**: Efficient model designed for web and mobile devices
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Upload an Image**: Click the upload area or drag and drop an image file
2. **AI Analysis**: The MobileNet model will automatically analyze the image
3. **View Results**: See the top 5 predictions with confidence scores
4. **Clear and Repeat**: Clear the image to try with a new one

## Technical Details

### MobileNet Model
- **Version**: MobileNet v2
- **Size**: ~16MB
- **Categories**: 1000+ ImageNet classes
- **Accuracy**: High accuracy optimized for mobile/web

### Architecture
- **Frontend**: Next.js 15 with TypeScript
- **ML Framework**: TensorFlow.js
- **Styling**: Tailwind CSS
- **Deployment**: Static export ready

### Files Structure

```
src/
├── app/
│   ├── page.tsx           # Main page with ImageRecognition component
│   ├── layout.tsx         # App layout
│   └── globals.css        # Global styles
├── components/
│   └── ImageRecognition.tsx # Main image recognition component
└── utils/
    └── imageClassifier.ts   # MobileNet wrapper utility
```

### Key Components

#### ImageClassifier Utility (`src/utils/imageClassifier.ts`)
- Singleton class for MobileNet model management
- Handles model loading and image classification
- Provides type-safe prediction interface

#### ImageRecognition Component (`src/components/ImageRecognition.tsx`)
- React component with drag-and-drop interface
- Real-time image preview and analysis
- Loading states and error handling
- Responsive design with confidence bars

## Customization

### Adding More Models
You can extend the app with additional TensorFlow.js models:

```typescript
// Example: Adding COCO-SSD for object detection
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export class ObjectDetector {
  async detectObjects(imageElement: HTMLImageElement) {
    const model = await cocoSsd.load();
    return await model.detect(imageElement);
  }
}
```

### Multilingual Support
For language learning, you can add translation services:

```typescript
// Example: Translate predictions to different languages
export async function translatePrediction(text: string, targetLang: string) {
  // Integrate with translation APIs
  return translatedText;
}
```

## Performance Optimization

1. **Model Caching**: MobileNet model is cached after first load
2. **Image Optimization**: Automatic resizing to 224x224 pixels
3. **Error Handling**: Graceful fallbacks for unsupported browsers
4. **Loading States**: User feedback during processing

## Browser Compatibility

- Chrome 61+
- Firefox 69+
- Safari 12+
- Edge 79+

*Note: Requires WebGL support for optimal performance*

## Deployment

The app is configured for static export and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

```bash
npm run build
npm run export
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- TensorFlow.js team for the amazing ML framework
- Google for the MobileNet model
- Next.js team for the excellent React framework
