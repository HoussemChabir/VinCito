import React, { useRef, useEffect, Fragment } from 'react';

interface FullTextViewProps {
  words: string[];
  currentPosition: number;
  chunkSize: number;
  isPlaying: boolean;
  onWordClick: (position: number) => void;
}

const FullTextView: React.FC<FullTextViewProps> = ({ words, currentPosition, chunkSize, isPlaying, onWordClick }) => {
  const activeWordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isPlaying && activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentPosition, isPlaying]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl h-full overflow-y-auto border-2 border-red-100">
      <p className="text-base sm:text-lg text-gray-700 leading-relaxed sm:leading-loose select-none font-serif-bionic">
        {words.map((word, index) => {
          const isHighlighted = index >= currentPosition && index < currentPosition + chunkSize;
          const splitPoint = Math.ceil(word.length / 2);
          const boldPart = word.substring(0, splitPoint);
          const regularPart = word.substring(splitPoint);

          return (
            <Fragment key={index}>
              <span
                ref={isHighlighted && index === currentPosition ? activeWordRef : null}
                onClick={() => onWordClick(index)}
                className={`transition-all duration-150 ease-in-out rounded-md px-0.5 py-0.5 cursor-pointer ${
                  isHighlighted
                    ? 'bg-red-500/20 text-red-600'
                    : 'text-gray-600 hover:bg-red-100'
                }`}
              >
                <span className="font-bold">{boldPart}</span>
                <span>{regularPart}</span>
              </span>
              {index < words.length - 1 && ' '}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
};

export default FullTextView;