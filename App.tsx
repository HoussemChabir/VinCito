import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import TextInput from './components/TextInput';
import RSVPReader from './components/RSVPReader';
import FullTextView from './components/FullTextView';
import AdUnit from './components/AdUnit';

const PRESET_TEXT = `Welcome to VinCito.

This tool uses RSVP (Rapid Serial Visual Presentation) to help you read faster. It displays words one by one at a set pace, minimizing eye movement and training your brain to process information more quickly.

To begin, you can paste your own text into the area above, or use the controls below to upload a .txt file. Use the controls to adjust your reading speed (WPM) and the number of words displayed at once (chunk size). Happy reading!`;

export default function App() {
  const [text, setText] = useState<string>(PRESET_TEXT);
  
  // State for RSVP reading mode
  const [wpm, setWpm] = useState<number>(300);
  const [chunkSize, setChunkSize] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [readingPosition, setReadingPosition] = useState<number>(0);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);

  useEffect(() => {
    if (isPlaying && words.length > 0) {
      // Ensure chunkSize is at least 1 to avoid division by zero or infinite loops
      const currentChunkSize = Math.max(1, chunkSize);
      const interval = (60 / wpm) * 1000 * currentChunkSize;
      
      const timer = setInterval(() => {
        setReadingPosition(prev => {
          const nextPosition = prev + currentChunkSize;
          if (nextPosition >= words.length) {
            setIsPlaying(false); // Stop at the end
            return 0; // Reset position
          }
          return nextPosition;
        });
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isPlaying, wpm, chunkSize, words.length]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    setIsPlaying(false);
    setReadingPosition(0);
  }, []);
  
  const handleClearText = useCallback(() => {
    setText('');
    setIsPlaying(false);
    setReadingPosition(0);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (words.length > 0) {
       if (readingPosition >= words.length -1) {
        setReadingPosition(0);
      }
      setIsPlaying(prev => !prev);
    }
  }, [words.length, readingPosition]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setReadingPosition(0);
  }, []);

  const handleWordClick = useCallback((newPosition: number) => {
    setReadingPosition(newPosition);
  }, []);

  // --- Ad Snippet ---
  // Developer Note: Replace this placeholder with your actual ad code from Google AdSense or another provider.
  // Make sure the ad code is responsive or fits within the container dimensions.
  const adSnippet1 = `
    <!-- Google AdSense Placeholder -->
    <div style="text-align:center; padding:10px; font-weight:bold; color:#ef4444;">
      ADVERTISEMENT
    </div>
    <!-- End Ad Placeholder -->
  `;

  return (
    <div className="bg-red-50 text-gray-800 min-h-screen antialiased px-4 sm:px-6 md:px-8 grid grid-rows-[auto_1fr_auto_auto]">
        <Header />
        
        <main className="flex flex-col py-4 overflow-hidden">
          {text ? (
            <div className="flex flex-col h-full gap-4 md:gap-6">
              <div className="flex-shrink-0 h-40 sm:h-48 md:h-1/3">
                <RSVPReader
                  words={words}
                  position={readingPosition}
                  chunkSize={chunkSize}
                  isPlaying={isPlaying}
                />
              </div>
              <div className="flex-grow h-0 md:h-2/3 overflow-hidden">
                 <FullTextView 
                    words={words}
                    currentPosition={readingPosition}
                    chunkSize={chunkSize}
                    isPlaying={isPlaying}
                    onWordClick={handleWordClick}
                 />
              </div>
            </div>
          ) : (
            <TextInput onTextChange={handleTextChange} />
          )}
        </main>
        
        {/* Ad Section */}
        <div className="flex items-center justify-center py-2">
          {/* Ad Placement */}
          <div className="w-full max-w-lg h-20 sm:h-24 bg-red-100/50 border border-red-200 rounded-lg flex items-center justify-center text-red-400">
             <AdUnit code={adSnippet1} />
          </div>
        </div>

        <footer className="w-full bg-red-50/80 backdrop-blur-sm py-4 border-t border-t-red-200">
          <Controls
            // General props
            onTextUpload={handleTextChange}
            onClearText={handleClearText}
            isTextLoaded={!!text}
            // Paced mode props
            wpm={wpm}
            onWpmChange={setWpm}
            chunkSize={chunkSize}
            onChunkSizeChange={setChunkSize}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
          />
        </footer>
    </div>
  );
}