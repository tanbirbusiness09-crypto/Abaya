import React, { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackTitle?: string;
}

export function SmartImage({
  src,
  alt,
  className = '',
  priority = false,
  fallbackTitle,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#EFE9E0] text-[#581C32] p-4 text-center ${className}`}
      >
        <span className="font-editorial text-lg font-semibold tracking-wide">LAYANA</span>
        {fallbackTitle && <span className="mt-1 text-xs text-[#777777] line-clamp-2">{fallbackTitle}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
