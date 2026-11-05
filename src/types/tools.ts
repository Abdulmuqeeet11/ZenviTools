export type ToolCategoryId =
  | 'pdf'
  | 'calculators'
  | 'image'
  | 'text'
  | 'qr-other';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolExample {
  input: string;
  output: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategoryId;
  shortDescription: string;
  fullDescription: string;
  popular?: boolean;
  recentlyAdded?: boolean;
  supportedFormats?: string[];
  instructions: string[];
  examples?: ToolExample[];
  faqs: ToolFAQ[];
  relatedToolIds: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface CategoryInfo {
  id: ToolCategoryId;
  name: string;
  slug: string;
  description: string;
  toolCount: number;
}
