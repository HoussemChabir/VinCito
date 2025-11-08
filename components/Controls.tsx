import React, { useRef, useCallback, useState } from 'react';
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
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string) => void;
  wpm: number;
  onWpmChange: (wpm: number) => void;
  chunkSize: number;
  onChunkSizeChange: (size: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  minWpm: number;
  maxWpm: number;
  wpmStep: number;
  minChunk: number;
  maxChunk: number;
}

const Controls: React.FC<ControlsProps> = ({
  onTextUpload,
  onClearText,
  isTextLoaded,
  onLoadingChange,
  onError,
  wpm,
  onWpmChange,
  chunkSize,
  onChunkSizeChange,
  isPlaying,
  onPlayPause,
  onReset,
  minWpm,
  maxWpm,
  wpmStep,
  minChunk,
  maxChunk,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      onError('File is too large. Please upload a file smaller than 10MB.');
      return;
    }

    setIsProcessing(true);
    onLoadingChange(true);

    try {
      if (file.type === 'application/pdf') {
        await processPDFFile(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        await processTextFile(file);
      } else {
        onError('Unsupported file type. Please upload a .txt or .pdf file.');
        onLoadingChange(false);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      onError(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      onLoadingChange(false);
      setIsProcessing(false);
    }
  }, [onTextUpload, onLoadingChange, onError]);

  const processPDFFile = useCallback(async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reject(new Error('Failed to read PDF file'));
      };

      reader.onload = async (e) => {
        if (!e.target?.result) {
          reject(new Error('No file content'));
          return;
        }

        try {
          const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
          const loadingTask = pdfjsLib.getDocument({
            data: typedarray,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/cmaps/',
            cMapPacked: true,
          });

          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          if (numPages === 0) {
            throw new Error('PDF contains no pages');
          }

          let fullText = '';
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
              .map((item: any) => {
                if ('str' in item) {
                  return item.str;
                }
                return '';
              })
              .filter((str: string) => str.trim().length > 0)
              .join(' ');

            if (pageText.trim()) {
              fullText += pageText + '\n\n';
            }
          }

          const trimmedText = fullText.trim();
          if (trimmedText.length === 0) {
            throw new Error('PDF contains no readable text');
          }

          onTextUpload(trimmedText);
          onLoadingChange(false);
          setIsProcessing(false);
          resolve();
        } catch (error) {
          console.error('PDF parsing error:', error);
          reject(new Error('Could not read the PDF file. It might be corrupted, protected, or contain only images.'));
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }, [onTextUpload, onLoadingChange]);

  const processTextFile = useCallback(async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };

      reader.onload = (e) => {
        try {
          const fileContent = e.target?.result as string;
          if (!fileContent || fileContent.trim().length === 0) {
            throw new Error('Text file is empty');
          }
          onTextUpload(fileContent);
          onLoadingChange(false);
          setIsProcessing(false);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.readAsText(file, 'UTF-8');
    });
  }, [onTextUpload, onLoadingChange]);

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-3 sm:gap-x-4 gap-y-3 sm:gap-y-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={handleUploadClick}
          disabled={isProcessing}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-500 text-white hover:bg-red-600 rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload .txt or .pdf file"
        >
          <UploadIcon />
          <span className="hidden xs:inline">{isProcessing ? 'Loading...' : 'Upload'}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.pdf,text/plain,application/pdf"
          disabled={isProcessing}
        />
        <button
          onClick={onClearText}
          disabled={!isTextLoaded || isProcessing}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-100 text-red-800 hover:bg-red-200 rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 font-semibold text-sm sm:text-base"
          title="Clear text"
        >
          <TrashIcon />
          <span className="hidden xs:inline">Clear</span>
        </button>
      </div>

      <div className="w-full sm:w-auto flex-grow flex items-center justify-center sm:justify-end gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 flex-wrap">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onPlayPause}
            disabled={!isTextLoaded || isProcessing}
            title={isPlaying ? 'Pause' : 'Play'}
            className="p-2.5 sm:p-3 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110 active:scale-95 touch-manipulation"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            onClick={onReset}
            disabled={!isTextLoaded || isProcessing}
            title="Reset"
            className="p-2.5 sm:p-3 bg-red-100 text-red-800 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110 active:scale-95 touch-manipulation"
          >
            <ResetIcon />
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-grow sm:max-w-[180px] md:max-w-[200px]">
          <label htmlFor="wpm" className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap min-w-[60px] sm:min-w-[70px] text-right">
            {wpm} WPM
          </label>
          <input
            id="wpm"
            type="range"
            min={minWpm}
            max={maxWpm}
            step={wpmStep}
            value={wpm}
            onChange={(e) => onWpmChange(Number(e.target.value))}
            disabled={!isTextLoaded || isPlaying || isProcessing}
            className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <label htmlFor="chunkSize" className="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">
            Chunk
          </label>
          <input
            id="chunkSize"
            type="number"
            min={minChunk}
            max={maxChunk}
            value={chunkSize}
            onChange={(e) => onChunkSizeChange(Number(e.target.value))}
            disabled={!isTextLoaded || isPlaying || isProcessing}
            className="w-14 sm:w-16 md:w-20 bg-white border border-red-200 rounded-lg p-1.5 sm:p-2 text-center disabled:opacity-50 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base touch-manipulation"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;