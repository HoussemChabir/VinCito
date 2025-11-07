import React, { useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import UploadIcon from './icons/UploadIcon';
import TrashIcon from './icons/TrashIcon';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import ResetIcon from './icons/ResetIcon';

// Set workerSrc for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

interface ControlsProps {
  onTextUpload: (text: string) => void;
  onClearText: () => void;
  isTextLoaded: boolean;
  wpm: number;
  onWpmChange: (wpm: number) => void;
  chunkSize: number;
  onChunkSizeChange: (size: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onTextUpload,
  onClearText,
  isTextLoaded,
  wpm,
  onWpmChange,
  chunkSize,
  onChunkSizeChange,
  isPlaying,
  onPlayPause,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset file input to allow re-uploading the same file
    event.target.value = '';

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) return;
        try {
          const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((s: any) => s.str).join(' ');
            fullText += pageText + '\n\n'; // Add spacing between pages
          }
          onTextUpload(fullText.trim());
        } catch (error) {
          console.error('Error parsing PDF:', error);
          alert('Could not read the PDF file. It might be corrupted or protected.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else { // Handle .txt files
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        onTextUpload(fileContent);
      };
      reader.readAsText(file);
    }
  }, [onTextUpload]);

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-4">
      {/* Group 1: File Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-red-500 text-white hover:bg-red-600 rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-semibold"
          title="Upload .txt or .pdf file"
        >
          <UploadIcon />
          <span className="hidden sm:inline">Upload</span>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.pdf" />
        <button
          onClick={onClearText}
          disabled={!isTextLoaded}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-red-100 text-red-800 hover:bg-red-200 rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 font-semibold"
          title="Clear text"
        >
          <TrashIcon />
           <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Group 2: RSVP Controls */}
      <div className="w-full sm:w-auto flex-grow flex items-center justify-center sm:justify-end gap-x-6 gap-y-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button onClick={onPlayPause} disabled={!isTextLoaded} title={isPlaying ? 'Pause' : 'Play'} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110 active:scale-95">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button onClick={onReset} disabled={!isTextLoaded} title="Reset" className="p-3 bg-red-100 text-red-800 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110 active:scale-95">
              <ResetIcon />
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-grow sm:max-w-[200px]">
          <label htmlFor="wpm" className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">{wpm} WPM</label>
          <input
            id="wpm"
            type="range"
            min="100" max="1200" step="25"
            value={wpm}
            onChange={(e) => onWpmChange(Number(e.target.value))}
            disabled={!isTextLoaded || isPlaying}
            className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
          <div className="flex items-center gap-3">
          <label htmlFor="chunkSize" className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">Chunk</label>
          <input
            id="chunkSize"
            type="number"
            min="1" max="5"
            value={chunkSize}
            onChange={(e) => onChunkSizeChange(Number(e.target.value))}
            disabled={!isTextLoaded || isPlaying}
            className="w-16 sm:w-20 bg-white border border-red-200 rounded-lg p-2 text-center disabled:opacity-50 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;