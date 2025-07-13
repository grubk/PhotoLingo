import ImageRecognition from "@/components/ImageRecognition";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PhotoLingo</h1>
          <p className="text-lg text-gray-600">AI-Powered Image Recognition for Language Learning</p>
        </header>
        
        <ImageRecognition />
      </div>
    </div>
  );
}
