import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as mobilenet from '@tensorflow-models/mobilenet';

export interface Prediction {
  className: string;
  probability: number;
}

export class ImageClassifier {
  private model: mobilenet.MobileNet | null = null;
  private isLoading = false;
  private isBackendReady = false;

  private async initializeBackend(): Promise<void> {
    if (this.isBackendReady) return;

    try {
      // Wait for TensorFlow.js to be ready
      await tf.ready();
      
      // Try to set WebGL backend first, fallback to CPU
      try {
        await tf.setBackend('webgl');
      } catch (error) {
        console.warn('WebGL backend not available, falling back to CPU:', error);
        await tf.setBackend('cpu');
      }
      
      console.log('TensorFlow.js backend initialized:', tf.getBackend());
      this.isBackendReady = true;
    } catch (error) {
      console.error('Error initializing TensorFlow.js backend:', error);
      throw error;
    }
  }

  async loadModel(): Promise<void> {
    if (this.model || this.isLoading) return;
    
    this.isLoading = true;
    try {
      // Initialize backend first
      await this.initializeBackend();
      
      // Load MobileNet model
      this.model = await mobilenet.load({
        version: 2,
        alpha: 1.0,
      });
      console.log('MobileNet model loaded successfully');
    } catch (error) {
      console.error('Error loading MobileNet model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async classifyImage(imageElement: HTMLImageElement): Promise<Prediction[]> {
    if (!this.model) {
      await this.loadModel();
    }

    if (!this.model) {
      throw new Error('Model failed to load');
    }

    try {
      // Get predictions from MobileNet
      const predictions = await this.model.classify(imageElement);
      
      return predictions.map(pred => ({
        className: pred.className,
        probability: pred.probability
      }));
    } catch (error) {
      console.error('Error classifying image:', error);
      throw error;
    }
  }

  async classifyImageFromFile(file: File): Promise<Prediction[]> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        try {
          const predictions = await this.classifyImage(img);
          resolve(predictions);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  isModelLoaded(): boolean {
    return this.model !== null;
  }
}

// Singleton instance
export const imageClassifier = new ImageClassifier();
