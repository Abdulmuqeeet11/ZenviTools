import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY, getToolById } from '../../../data/toolsRegistry';
import { ToolDetailPage } from '../../../views/ToolDetailPage';

export function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) {
    return {
      title: 'Tool Not Found – Zenvi Tools',
    };
  }
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
    twitter: {
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) {
    notFound();
  }
  return <ToolDetailPage toolId={id} />;
}
