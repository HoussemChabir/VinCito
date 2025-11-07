import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  /**
   * The raw ad network snippet, which can include HTML and <script> tags.
   */
  code: string;
}

/**
 * A reusable React component for rendering ad network snippets.
 *
 * This component takes a string of raw ad code (HTML/JS) and injects it into the DOM.
 * It's designed to correctly handle and execute script tags found within the ad code,
 * which is a common requirement for ad networks like Google AdSense.
 *
 * It uses a `useEffect` hook to lazy-load the snippet after the component mounts,
 * improving page performance.
 */
const AdUnit: React.FC<AdUnitProps> = ({ code }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adContainer = adContainerRef.current;
    if (!adContainer || !code) {
      return;
    }

    // Clear previous ad content to prevent issues on re-renders.
    adContainer.innerHTML = '';

    // The ad code is parsed into a document fragment.
    // This is safer and more performant than using innerHTML directly for complex snippets.
    const fragment = document.createRange().createContextualFragment(code);
    
    // The fragment (containing HTML nodes and non-executed script nodes) is appended.
    adContainer.appendChild(fragment);

    // Scripts inserted via fragments or innerHTML are not executed by browsers for security.
    // We must find these script elements and create new, executable copies.
    const scripts = adContainer.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const oldScript = scripts[i];
      const newScript = document.createElement('script');

      // Copy all attributes from the original script (e.g., src, async, data-ad-client).
      for (const attr of oldScript.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }
      
      // Copy the inline script content.
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }

      // Replace the inert script node with the new, executable script node.
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    }

  }, [code]); // Re-run the effect if the ad code prop changes.

  return <div ref={adContainerRef} className="w-full h-full" />;
};

export default AdUnit;
