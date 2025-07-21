"use client";

import ImageRecognition from "@/components/ImageRecognition";
import SplitText from "@/components/SplitText";


export default function Home() {
  return (
    <div
      className="min-h-screen bg-gray-50 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/background.svg)` }}
    >
      <div className="max-w-4xl mx-auto relative z-10 p-8">
        <header className="text-center mb-8">
          <div className="mb-2">
            <SplitText
              text="PhotoLingo"
              className="text-2xl font-semibold text-center"
              delay={2}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>
          <SplitText
            text="AI-Powered Image Recognition for Language Learning"
            className="text-sm font-light text-center text-gray-600"
            delay={50}
            duration={0.3}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </header>
        <ImageRecognition />
      </div>
    </div>
  );
}


