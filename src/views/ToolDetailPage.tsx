'use client';
import React, { Suspense, lazy } from 'react';
import { getToolById } from '../data/toolsRegistry';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { navigateTo } from '../utils/navigation';

const PdfTools = lazy(() =>
  import('../tools/PdfTools').then((m) => ({ default: m.PdfTools }))
);
const CalculatorTools = lazy(() =>
  import('../tools/CalculatorTools').then((m) => ({ default: m.CalculatorTools }))
);
const ImageTools = lazy(() =>
  import('../tools/ImageTools').then((m) => ({ default: m.ImageTools }))
);
const TextTools = lazy(() =>
  import('../tools/TextTools').then((m) => ({ default: m.TextTools }))
);
const QrOtherTools = lazy(() =>
  import('../tools/QrOtherTools').then((m) => ({ default: m.QrOtherTools }))
);

export const ToolDetailPage: React.FC<{ toolId: string }> = ({ toolId }) => {
  const tool = getToolById(toolId);

  if (!tool) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#E4D9FA] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#38205F]">Tool Not Found</h1>
          <p className="mt-2 text-sm text-[#5B4D7A]">
            The tool you requested could not be found. Browse all available
            tools below.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('/all-tools')}
            className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#7045C6] text-white cursor-pointer"
          >
            Browse All Tools
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToolPageLayout tool={tool}>
      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-[#5B4D7A]">
            Loading {tool.name}...
          </div>
        }
      >
        {tool.category === 'pdf' && <PdfTools toolId={tool.id} />}
        {tool.category === 'calculators' && <CalculatorTools toolId={tool.id} />}
        {tool.category === 'image' && <ImageTools toolId={tool.id} />}
        {tool.category === 'text' && <TextTools toolId={tool.id} />}
        {tool.category === 'qr-other' && <QrOtherTools toolId={tool.id} />}
      </Suspense>
    </ToolPageLayout>
  );
};
