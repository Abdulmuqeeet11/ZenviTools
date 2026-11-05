import React from 'react';

interface AdPlaceholderProps {
  slotName?: string;
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotName = 'Responsive Display Unit',
  className = '',
}) => {
  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 rounded-2xl border border-dashed border-[#D6C6F7] bg-white/70 px-4 py-6 text-center ${className}`}
    >
      <p className="text-[11px] font-medium tracking-wider uppercase text-[#7B6B9E] mb-1">
        Advertisement
      </p>
      <p className="text-xs text-[#6E5F8F]">
        Reserved ad placement ({slotName}) — No ad scripts loaded until AdSense approval.
      </p>
    </aside>
  );
};
