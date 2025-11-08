import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import TextInput from './components/TextInput';
import RSVPReader from './components/RSVPReader';
import FullTextView from './components/FullTextView';
import AdUnit from './components/AdUnit';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const PRESET_TEXT = `Welcome to VinCito.

This tool uses RSVP (Rapid Serial Visual Presentation) to help you read faster. It displays words one by one at a set pace, minimizing eye movement and training your brain to process information more quickly.

To begin, you can paste your own text into the area above, or use the controls below to upload a .txt or .pdf file. Use the controls to adjust your reading speed (WPM) and the number of words displayed at once (chunk size). Happy reading!`;

const MIN_WPM = 100;
const MAX_WPM = 1200;
const WPM_STEP = 25;
const MIN_CHUNK = 1;
const MAX_CHUNK = 5;
const DEFAULT_WPM = 300;
const DEFAULT_CHUNK = 1;

export default function App() {
  const [text, setText] = useState<string>(PRESET_TEXT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [wpm, setWpm] = useState<number>(DEFAULT_WPM);
  const [chunkSize, setChunkSize] = useState<number>(DEFAULT_CHUNK);
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
    if (newText && newText.trim().length > 0) {
      setText(newText);
      setIsPlaying(false);
      setReadingPosition(0);
      setError('');
    }
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);
  
  const handleClearText = useCallback(() => {
    setText('');
    setIsPlaying(false);
    setReadingPosition(0);
    setError('');
  }, []);

  const handlePlayPause = useCallback(() => {
    if (words.length > 0) {
      if (readingPosition >= words.length - 1) {
        setReadingPosition(0);
      }
      setIsPlaying(prev => !prev);
      setError('');
    }
  }, [words.length, readingPosition]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setReadingPosition(0);
  }, []);

  const handleWordClick = useCallback((newPosition: number) => {
    if (newPosition >= 0 && newPosition < words.length) {
      setReadingPosition(newPosition);
      setIsPlaying(false);
    }
  }, [words.length]);

  const handleWpmChange = useCallback((newWpm: number) => {
    const clampedWpm = Math.max(MIN_WPM, Math.min(MAX_WPM, newWpm));
    setWpm(clampedWpm);
  }, []);

  const handleChunkSizeChange = useCallback((newChunk: number) => {
    const clampedChunk = Math.max(MIN_CHUNK, Math.min(MAX_CHUNK, newChunk));
    setChunkSize(clampedChunk);
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
    <div className="bg-red-50 text-gray-800 min-h-screen antialiased px-3 sm:px-4 md:px-6 lg:px-8 grid grid-rows-[auto_1fr_auto_auto] touch-manipulation">
        <Header />

        {error && (
          <div className="px-3 py-2">
            <ErrorMessage message={error} onDismiss={() => setError('')} />
          </div>
        )}

        <main className="flex flex-col py-3 sm:py-4 overflow-hidden min-h-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : text ? (
            <div className="flex flex-col h-full gap-3 sm:gap-4 md:gap-6">
              <div className="flex-shrink-0 h-32 xs:h-36 sm:h-40 md:h-48 lg:h-1/3">
                <RSVPReader
                  words={words}
                  position={readingPosition}
                  chunkSize={chunkSize}
                  isPlaying={isPlaying}
                />
              </div>
              <div className="flex-grow min-h-0 overflow-hidden">
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
        
        {text && (
          <div className="flex items-center justify-center py-2 px-3">
            <div className="w-full max-w-lg h-16 sm:h-20 md:h-24 bg-red-100/50 border border-red-200 rounded-lg flex items-center justify-center text-red-400">
               <AdUnit code={adSnippet1} />
            </div>
          </div>
        )}

        <footer className="w-full bg-red-50/80 backdrop-blur-sm py-3 sm:py-4 border-t border-t-red-200">
          <Controls
            onTextUpload={handleTextChange}
            onClearText={handleClearText}
            isTextLoaded={!!text}
            onLoadingChange={handleLoadingChange}
            onError={handleError}
            wpm={wpm}
            onWpmChange={handleWpmChange}
            chunkSize={chunkSize}
            onChunkSizeChange={handleChunkSizeChange}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            minWpm={MIN_WPM}
            maxWpm={MAX_WPM}
            wpmStep={WPM_STEP}
            minChunk={MIN_CHUNK}
            maxChunk={MAX_CHUNK}
          />
        </footer>
    </div>
  );
}