'use client';
import React from 'react';
import {
  FileText,
  Calculator,
  Image as ImageIcon,
  Type,
  QrCode,
  ArrowUpRight,
} from 'lucide-react';
import { ToolCategoryId, ToolDefinition } from '../types/tools';
import { handleLinkClick } from '../utils/navigation';

const CATEGORY_LABELS: Record<ToolCategoryId, string> = {
  pdf: 'PDF & Document',
  calculators: 'Calculator',
  image: 'Image Tool',
  text: 'Text Tool',
  'qr-other': 'QR & Utility',
};

function CategoryIcon({ category }: { category: ToolCategoryId }) {
  const cls = 'w-5 h-5 text-[#7045C6]';
  switch (category) {
    case 'pdf':
      return <FileText className={cls} />;
    case 'calculators':
      return <Calculator className={cls} />;
    case 'image':
      return <ImageIcon className={cls} />;
    case 'text':
      return <Type className={cls} />;
    case 'qr-other':
      return <QrCode className={cls} />;
  }
}

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const href = `/tool/${tool.id}`;

  return (
    <a
      href={href}
      onClick={(e) => handleLinkClick(e, href)}
      className="group flex flex-col justify-between bg-white border border-[#E4D9FA] rounded-2xl p-5 hover:border-[#7045C6] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7045C6]"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F3FF] border border-[#E4D9FA] flex items-center justify-center shrink-0">
            <CategoryIcon category={tool.category} />
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#8C7CAE] group-hover:text-[#7045C6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </div>

        <h3 className="text-base font-semibold text-[#38205F] group-hover:text-[#7045C6] transition-colors mb-1.5">
          {tool.name}
        </h3>

        <p className="text-sm text-[#5B4D7A] leading-relaxed line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F3ECFF] flex items-center gap-2 text-xs text-[#7B6B9E]">
        <span>{CATEGORY_LABELS[tool.category]}</span>
        {tool.popular && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#7045C6]">Popular</span>
          </>
        )}
        {tool.recentlyAdded && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#38205F]">New</span>
          </>
        )}
      </div>
    </a>
  );
};
