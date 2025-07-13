import ImageRecognition from "@/components/ImageRecognition";
import DotGrid from "@/components/dotgrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div style={{ width: '100%', height: '100vh', position: 'absolute' }}>
        <DotGrid
          dotSize={40}
          gap={15}
          baseColor="rgba(179, 255, 186, 0.4)"
          activeColor="rgba(179, 255, 186, 0.4)"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="max-w-4xl mx-auto relative z-10 p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PhotoLingo</h1>
          <p className="text-lg text-gray-600">AI-Powered Image Recognition for Language Learning</p>
        </header>
        <ImageRecognition />
      </div>
    </div>
  );
}
