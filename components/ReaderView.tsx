import React, { useMemo } from 'react';

interface ReaderViewProps {
  text: string;
  visibleHeight: number;
  isHalfView: boolean;
}

const ReaderView: React.FC<ReaderViewProps> = ({ text, visibleHeight, isHalfView }) => {
  const lines = useMemo(() => text.split('\n'), [text]);

  const textStyle = useMemo(() => (
    isHalfView
      ? {
          clipPath: `inset(0 0 ${100 - visibleHeight}% 0)`,
        }
      : {}
  ), [isHalfView, visibleHeight]);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg flex-grow overflow-y-auto w-full h-full">
      <div className="text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose md:leading-loose text-gray-300 select-none">
        {lines.map((line, index) => (
          // The <p> tag provides the line spacing via its parent's line-height.
          <p key={index}>
            {/* The <span> wraps the text, fitting its height to the content.
                clip-path is applied here for a more accurate cut on the letters. */}
            <span style={textStyle} className="inline-block transition-all duration-200 ease-in-out">
              {line || '\u00A0'} {/* Use non-breaking space for empty lines */}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default ReaderView;
