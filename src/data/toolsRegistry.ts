import { CategoryInfo, ToolCategoryId, ToolDefinition } from '../types/tools';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'pdf',
    name: 'PDF & Document Tools',
    slug: 'pdf-tools',
    description:
      'Convert, merge, split, compress, rotate, organize, and manage PDF and office documents directly in your browser.',
    toolCount: 20,
  },
  {
    id: 'calculators',
    name: 'Calculator Tools',
    slug: 'calculators',
    description:
      'Accurate financial, academic, health, date, time, and scientific calculators with step-by-step explanations.',
    toolCount: 20,
  },
  {
    id: 'image',
    name: 'Image Tools',
    slug: 'image-tools',
    description:
      'Compress, resize, crop, rotate, inspect, and convert JPG, PNG, and WEBP images without uploading to external servers.',
    toolCount: 13,
  },
  {
    id: 'text',
    name: 'Text Tools',
    slug: 'text-tools',
    description:
      'Count words and characters, transform text casing, clean formatting, remove duplicates, and convert text to speech.',
    toolCount: 14,
  },
  {
    id: 'qr-other',
    name: 'QR & Utility Tools',
    slug: 'qr-other-tools',
    description:
      'Generate and scan QR codes, create secure passwords, convert units, currencies, colors, Base64, and number systems.',
    toolCount: 20,
  },
];

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // ==========================================
  // 1. PDF & DOCUMENT TOOLS (20)
  // ==========================================
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    shortDescription: 'Convert one or more JPG images into a clean, printable PDF document.',
    fullDescription:
      'Convert JPG and JPEG photographs or scanned pages into a standard PDF file locally in your browser. Choose page orientation, margins, and image fit before downloading.',
    popular: true,
    supportedFormats: ['JPG', 'JPEG', 'PDF'],
    instructions: [
      'Select or drag and drop one or more JPG/JPEG images into the upload area.',
      'Choose your preferred page size (A4, Letter, or Fit to Image) and orientation.',
      'Click Convert to PDF to generate your document locally.',
      'Download the finished PDF file immediately.',
    ],
    faqs: [
      {
        question: 'Are my JPG images uploaded to a server?',
        answer: 'No. All image-to-PDF conversion happens locally inside your web browser.',
      },
      {
        question: 'Can I combine multiple JPG files into one PDF?',
        answer: 'Yes, you can select multiple JPG files and each image will be placed on its own page in order.',
      },
    ],
    relatedToolIds: ['png-to-pdf', 'multiple-images-to-pdf', 'pdf-to-jpg', 'compress-pdf'],
    seoTitle: 'JPG to PDF Converter – Free Online Image to PDF | Zenvi Tools',
    seoDescription: 'Convert JPG images to PDF online for free. Fast, private, browser-based conversion with custom page size and orientation.',
  },
  {
    id: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'pdf',
    shortDescription: 'Turn PNG screenshots and graphics into a high-quality PDF document.',
    fullDescription:
      'Convert PNG images—including transparent graphics and high-resolution screenshots—into a standard PDF document without losing sharpness.',
    supportedFormats: ['PNG', 'PDF'],
    instructions: [
      'Upload one or more PNG files using drag-and-drop or the file picker.',
      'Select page size and margin preferences.',
      'Click Convert to PDF and download your file.',
    ],
    faqs: [
      {
        question: 'Does PNG to PDF preserve image resolution?',
        answer: 'Yes, the original PNG pixel dimensions are embedded into the PDF page.',
      },
    ],
    relatedToolIds: ['jpg-to-pdf', 'webp-to-pdf', 'multiple-images-to-pdf', 'pdf-to-png'],
    seoTitle: 'PNG to PDF Converter – Free & Private | Zenvi Tools',
    seoDescription: 'Convert PNG images to PDF documents directly in your browser. No file uploads required.',
  },
  {
    id: 'webp-to-pdf',
    name: 'WEBP to PDF',
    category: 'pdf',
    shortDescription: 'Convert modern WEBP web images into universally compatible PDF files.',
    fullDescription:
      'Transform WEBP images into standard PDF documents that can be opened, printed, and shared on any device or operating system.',
    recentlyAdded: true,
    supportedFormats: ['WEBP', 'PDF'],
    instructions: [
      'Select one or more WEBP images from your device.',
      'Configure page layout options.',
      'Click Convert to PDF to decode and package your images into a PDF.',
    ],
    faqs: [
      {
        question: 'How does WEBP to PDF work in the browser?',
        answer: 'Your browser decodes the WEBP image on an HTML5 canvas and embeds it into a PDF document using pdf-lib.',
      },
    ],
    relatedToolIds: ['jpg-to-pdf', 'png-to-pdf', 'webp-converter', 'multiple-images-to-pdf'],
    seoTitle: 'WEBP to PDF Converter – Online & Free | Zenvi Tools',
    seoDescription: 'Convert WEBP images to PDF documents quickly and privately in your browser with Zenvi Tools.',
  },
  {
    id: 'multiple-images-to-pdf',
    name: 'Multiple Images to PDF',
    category: 'pdf',
    shortDescription: 'Combine JPG, PNG, and WEBP images into a single multi-page PDF.',
    fullDescription:
      'Batch-convert mixed image formats (JPG, PNG, WEBP) into one organized multi-page PDF document. Reorder images before generating your PDF.',
    popular: true,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'PDF'],
    instructions: [
      'Upload multiple JPG, PNG, or WEBP files at once.',
      'Arrange the image order using the move up/down controls.',
      'Select page size and margin settings, then click Create PDF.',
    ],
    faqs: [
      {
        question: 'Can I mix JPG, PNG, and WEBP in the same PDF?',
        answer: 'Yes, you can combine any supported image formats into a single PDF file.',
      },
    ],
    relatedToolIds: ['jpg-to-pdf', 'png-to-pdf', 'merge-pdf', 'image-to-pdf'],
    seoTitle: 'Multiple Images to PDF – Combine Photos into PDF | Zenvi Tools',
    seoDescription: 'Combine multiple JPG, PNG, and WEBP images into one PDF document locally in your browser.',
  },
  {
    id: 'word-docx-to-pdf',
    name: 'Word DOCX to PDF',
    category: 'pdf',
    shortDescription: 'Convert Microsoft Word (.docx) documents into readable PDF files.',
    fullDescription:
      'Extract text, headings, lists, and tables from .docx Word documents and render them into a clean, downloadable PDF file directly in your browser. Note: Complex custom Word macros, floating text boxes, or proprietary fonts are simplified to standard PDF typography.',
    supportedFormats: ['DOCX', 'PDF'],
    instructions: [
      'Upload a .docx Word document.',
      'Preview the extracted document structure.',
      'Click Convert to PDF to generate and download your PDF.',
    ],
    faqs: [
      {
        question: 'Are complex Word layouts preserved 100% identically?',
        answer:
          'Browser-based DOCX conversion preserves headings, paragraphs, bold/italic formatting, and lists cleanly, while complex floating elements or custom desktop fonts are rendered using standard PDF fonts.',
      },
      {
        question: 'Does this support older .doc binary files?',
        answer: 'No, only modern .docx (Office Open XML) files are supported.',
      },
    ],
    relatedToolIds: ['pdf-to-editable-docx', 'excel-xlsx-to-pdf', 'powerpoint-pptx-to-pdf', 'merge-pdf'],
    seoTitle: 'Word DOCX to PDF Converter – Free Online | Zenvi Tools',
    seoDescription: 'Convert Word DOCX files to PDF directly in your browser without uploading private documents.',
  },
  {
    id: 'excel-xlsx-to-pdf',
    name: 'Excel XLSX to PDF',
    category: 'pdf',
    shortDescription: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) into formatted PDF tables.',
    fullDescription:
      'Parse Excel workbooks and CSV files using SheetJS and export each worksheet into clean, paginated PDF tables.',
    supportedFormats: ['XLSX', 'XLS', 'CSV', 'PDF'],
    instructions: [
      'Upload an .xlsx, .xls, or .csv spreadsheet.',
      'Select the worksheet you want to export.',
      'Click Convert to PDF to download the formatted table as a PDF.',
    ],
    faqs: [
      {
        question: 'Can I choose which Excel sheet to convert?',
        answer: 'Yes, if your workbook has multiple sheets, you can pick the specific sheet before exporting.',
      },
    ],
    relatedToolIds: ['word-docx-to-pdf', 'powerpoint-pptx-to-pdf', 'merge-pdf'],
    seoTitle: 'Excel XLSX to PDF Converter – Spreadsheet to PDF | Zenvi Tools',
    seoDescription: 'Convert Excel XLSX and CSV spreadsheets into clean PDF tables locally in your browser.',
  },
  {
    id: 'powerpoint-pptx-to-pdf',
    name: 'PowerPoint PPTX to PDF',
    category: 'pdf',
    shortDescription: 'Extract slides from PowerPoint (.pptx) presentations into a PDF deck.',
    fullDescription:
      'Read .pptx presentation archives locally in your browser and render slide titles, bullet points, and speaker text into a landscape PDF deck. Note: Complex animations, SmartArt, and embedded charts are converted as structured text slides.',
    recentlyAdded: true,
    supportedFormats: ['PPTX', 'PDF'],
    instructions: [
      'Upload a .pptx PowerPoint presentation file.',
      'Review the detected slide count and text preview.',
      'Click Convert to PDF to generate a landscape PDF presentation.',
    ],
    faqs: [
      {
        question: 'What elements are included when converting PPTX to PDF in the browser?',
        answer:
          'Slide text, titles, and bullet points are extracted from the PPTX XML and formatted onto landscape PDF pages. Complex vector animations and embedded charts are not rendered.',
      },
    ],
    relatedToolIds: ['word-docx-to-pdf', 'excel-xlsx-to-pdf', 'merge-pdf'],
    seoTitle: 'PowerPoint PPTX to PDF Converter | Zenvi Tools',
    seoDescription: 'Convert PowerPoint PPTX slides to PDF online in your browser. Fast and private.',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    shortDescription: 'Render PDF pages into high-resolution JPG images.',
    fullDescription:
      'Convert every page of a PDF document into crisp JPG images using PDF.js. Download individual pages or all pages bundled in a ZIP archive.',
    popular: true,
    supportedFormats: ['PDF', 'JPG'],
    instructions: [
      'Upload a PDF file from your device.',
      'Choose rendering quality (Standard 1.5x or High 2.0x scale).',
      'Click Convert to JPG and download individual images or a ZIP file.',
    ],
    faqs: [
      {
        question: 'Can I download all converted JPG pages at once?',
        answer: 'Yes, multi-page PDFs can be downloaded as a single ZIP file containing all JPG pages.',
      },
    ],
    relatedToolIds: ['pdf-to-png', 'jpg-to-pdf', 'compress-pdf', 'extract-pdf-pages'],
    seoTitle: 'PDF to JPG Converter – Extract PDF Pages as Images | Zenvi Tools',
    seoDescription: 'Convert PDF pages to high-quality JPG images online for free. Download single pages or ZIP.',
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf',
    shortDescription: 'Convert PDF pages into lossless PNG images.',
    fullDescription:
      'Render PDF pages to lossless PNG images with sharp text and graphics. Ideal for presentations, documentation, and web publishing.',
    supportedFormats: ['PDF', 'PNG'],
    instructions: [
      'Select or drop your PDF document.',
      'Choose your desired resolution scale.',
      'Click Convert to PNG and download your images or ZIP archive.',
    ],
    faqs: [
      {
        question: 'Why choose PNG over JPG for PDF pages?',
        answer: 'PNG uses lossless compression, keeping text, diagrams, and sharp edges free of compression artifacts.',
      },
    ],
    relatedToolIds: ['pdf-to-jpg', 'png-to-pdf', 'extract-pdf-pages'],
    seoTitle: 'PDF to PNG Converter – Lossless PDF Page Images | Zenvi Tools',
    seoDescription: 'Convert PDF pages into lossless PNG images directly in your browser.',
  },
  {
    id: 'pdf-to-editable-docx',
    name: 'PDF to editable DOCX',
    category: 'pdf',
    shortDescription: 'Extract text and structure from a PDF into an editable Word (.docx) file.',
    fullDescription:
      'Extract text lines and page breaks from text-based PDFs and build a real .docx Word document. Note: Scanned image-only PDFs without embedded text require OCR and will not produce editable text; complex multi-column layouts are converted to sequential paragraphs.',
    popular: true,
    supportedFormats: ['PDF', 'DOCX'],
    instructions: [
      'Upload a text-based PDF document.',
      'Click Convert to DOCX to extract text by page and line.',
      'Download the generated .docx file and open it in Microsoft Word, Google Docs, or LibreOffice.',
    ],
    faqs: [
      {
        question: 'Does this work on scanned PDFs?',
        answer:
          'No. This tool extracts embedded text from digital PDFs. Scanned PDFs that contain only images without a text layer cannot be converted to editable text without an OCR engine.',
      },
      {
        question: 'Will exact column layouts and graphics be preserved?',
        answer:
          'Text content and page breaks are preserved as editable paragraphs, while complex multi-column positioning and vector graphics are simplified.',
      },
    ],
    relatedToolIds: ['word-docx-to-pdf', 'extract-pdf-pages', 'merge-pdf'],
    seoTitle: 'PDF to Editable DOCX Converter – Free Online | Zenvi Tools',
    seoDescription: 'Convert text-based PDF files into editable Word DOCX documents locally in your browser.',
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    shortDescription: 'Combine multiple PDF files into one unified PDF document.',
    fullDescription:
      'Merge two or more PDF files in any order you choose. Reorder uploaded PDFs before combining them into a single downloadable PDF.',
    popular: true,
    supportedFormats: ['PDF'],
    instructions: [
      'Upload two or more PDF files.',
      'Use the up/down buttons to arrange the exact order of documents.',
      'Click Merge PDFs and download your combined document.',
    ],
    faqs: [
      {
        question: 'Is there a limit on how many PDFs I can merge?',
        answer: 'You can merge as many PDFs as your browser memory comfortably supports, with zero server upload limits.',
      },
    ],
    relatedToolIds: ['split-pdf', 'rearrange-pdf-pages', 'compress-pdf', 'multiple-images-to-pdf'],
    seoTitle: 'Merge PDF Files Online – Combine PDFs Free | Zenvi Tools',
    seoDescription: 'Combine multiple PDF documents into one file in seconds. 100% client-side and private.',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    shortDescription: 'Separate a PDF into individual pages or custom page ranges.',
    fullDescription:
      'Split a multi-page PDF into separate single-page PDFs (downloaded as a ZIP) or extract a specific page range into a new PDF.',
    popular: true,
    supportedFormats: ['PDF'],
    instructions: [
      'Upload a multi-page PDF file.',
      'Choose to split into all individual pages or specify a custom range (e.g., 1-3, 5).',
      'Click Split PDF and download your resulting PDF or ZIP archive.',
    ],
    faqs: [
      {
        question: 'How do I format custom page ranges?',
        answer: 'Use commas and hyphens, such as "1-3, 5, 8-10", to specify which pages to include.',
      },
    ],
    relatedToolIds: ['extract-pdf-pages', 'delete-pdf-pages', 'merge-pdf'],
    seoTitle: 'Split PDF Online – Separate PDF Pages Free | Zenvi Tools',
    seoDescription: 'Split a PDF into individual pages or custom page ranges directly in your browser.',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf',
    shortDescription: 'Reduce PDF file size while keeping text and visuals readable.',
    fullDescription:
      'Optimize PDF structure by stripping redundant metadata and enabling object stream compression, or optionally re-render pages at a chosen DPI/quality for maximum size reduction.',
    popular: true,
    supportedFormats: ['PDF'],
    instructions: [
      'Upload the PDF file you want to shrink.',
      'Select Standard (lossless structure optimization) or Strong (rasterized page compression).',
      'Click Compress PDF and compare the original vs. compressed file size.',
    ],
    faqs: [
      {
        question: 'What is the difference between Standard and Strong compression?',
        answer:
          'Standard compression keeps vector text sharp while optimizing PDF object streams. Strong compression renders pages at lower JPEG quality for much smaller file sizes on image-heavy PDFs.',
      },
    ],
    relatedToolIds: ['merge-pdf', 'split-pdf', 'image-compressor'],
    seoTitle: 'Compress PDF Online – Reduce PDF File Size | Zenvi Tools',
    seoDescription: 'Reduce PDF file size locally in your browser with lossless or strong compression modes.',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf',
    shortDescription: 'Rotate all or selected PDF pages by 90°, 180°, or 270°.',
    fullDescription:
      'Fix sideways or upside-down scanned PDF pages permanently. Rotate every page or target specific page numbers.',
    supportedFormats: ['PDF'],
    instructions: [
      'Upload your PDF document.',
      'Choose rotation angle (90° clockwise, 180°, or 270° clockwise) and target pages.',
      'Click Rotate PDF and download the corrected file.',
    ],
    faqs: [
      {
        question: 'Can I rotate only specific pages instead of the whole PDF?',
        answer: 'Yes, you can apply rotation to all pages or enter specific page numbers like "1, 3-4".',
      },
    ],
    relatedToolIds: ['rearrange-pdf-pages', 'delete-pdf-pages', 'image-rotator'],
    seoTitle: 'Rotate PDF Pages Online – Permanently Save Orientation | Zenvi Tools',
    seoDescription: 'Rotate PDF pages 90, 180, or 270 degrees online and save the updated PDF.',
  },
  {
    id: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'pdf',
    shortDescription: 'Pull specific pages out of a PDF into a brand-new document.',
    fullDescription:
      'Select exact page numbers or ranges from a large PDF and save them as a standalone PDF file.',
    supportedFormats: ['PDF'],
    instructions: [
      'Upload your source PDF.',
      'Enter the page numbers or ranges to extract (e.g., 2, 4-6).',
      'Click Extract Pages and download the new PDF.',
    ],
    faqs: [
      {
        question: 'Does extracting pages modify my original file?',
        answer: 'No, your original file remains untouched on your device while a new PDF is created.',
      },
    ],
    relatedToolIds: ['delete-pdf-pages', 'split-pdf', 'rearrange-pdf-pages'],
    seoTitle: 'Extract PDF Pages Online – Save Selected Pages | Zenvi Tools',
    seoDescription: 'Extract specific pages from any PDF document into a new PDF file.',
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'pdf',
    shortDescription: 'Remove unwanted pages from a PDF document in seconds.',
    fullDescription:
      'Clean up reports, contracts, or scanned packets by removing blank or unnecessary pages.',
    supportedFormats: ['PDF'],
    instructions: [
      'Upload your PDF document.',
      'Enter the page numbers or ranges you want to remove (e.g., 1, 5-7).',
      'Click Delete Pages and download the cleaned PDF.',
    ],
    faqs: [
      {
        question: 'What happens if I try to delete all pages?',
        answer: 'The tool validates your input so at least one page remains in the output PDF.',
      },
    ],
    relatedToolIds: ['extract-pdf-pages', 'rearrange-pdf-pages', 'split-pdf'],
    seoTitle: 'Delete PDF Pages Online – Remove Unwanted Pages | Zenvi Tools',
    seoDescription: 'Remove specific pages from a PDF document quickly and privately.',
  },
  {
    id: 'add-page-numbers-to-pdf',
    name: 'Add Page Numbers to PDF',
    category: 'pdf',
    shortDescription: 'Stamp clean page numbers onto every page of your PDF.',
    fullDescription:
      'Add customizable page numbering (e.g., "1", "Page 1 of 10") at the bottom center, bottom right, or top right of every PDF page.',
    recentlyAdded: true,
    supportedFormats: ['PDF'],
    instructions: [
      'Upload your PDF document.',
      'Choose number format, position, and font size.',
      'Click Add Page Numbers and download your numbered PDF.',
    ],
    faqs: [
      {
        question: 'Can I include the total page count like "Page 1 of 5"?',
        answer: 'Yes, you can choose between simple numbers (1, 2, 3) or "Page X of Y" format.',
      },
    ],
    relatedToolIds: ['merge-pdf', 'rearrange-pdf-pages', 'rotate-pdf'],
    seoTitle: 'Add Page Numbers to PDF Online – Free | Zenvi Tools',
    seoDescription: 'Insert customizable page numbers into any PDF document directly in your browser.',
  },
  {
    id: 'rearrange-pdf-pages',
    name: 'Rearrange PDF Pages',
    category: 'pdf',
    shortDescription: 'Reorder PDF pages into any custom sequence.',
    fullDescription:
      'Fix out-of-order scans or reorganize presentation handouts by specifying a new page sequence or moving pages up and down.',
    supportedFormats: ['PDF'],
    instructions: [
      'Upload your PDF document.',
      'Reorder the page list using the move controls or enter a custom sequence (e.g., 3, 1, 2).',
      'Click Save New Order and download the rearranged PDF.',
    ],
    faqs: [
      {
        question: 'Can I duplicate a page in the new order?',
        answer: 'Yes, entering a page number more than once in the custom sequence will include it multiple times.',
      },
    ],
    relatedToolIds: ['rotate-pdf', 'delete-pdf-pages', 'merge-pdf'],
    seoTitle: 'Rearrange PDF Pages Online – Reorder PDF | Zenvi Tools',
    seoDescription: 'Reorder and organize PDF pages in any sequence directly in your browser.',
  },
  {
    id: 'protect-pdf-with-password',
    name: 'Protect PDF with Password',
    category: 'pdf',
    shortDescription: 'Encrypt a PDF with a user open password and permission restrictions.',
    fullDescription:
      'Add password protection to your PDF document locally in your browser. Note: Browser-side encryption renders pages into a password-encrypted PDF container using jsPDF.',
    supportedFormats: ['PDF'],
    instructions: [
      'Upload the PDF you want to protect.',
      'Enter a strong open password (and optional owner password).',
      'Click Protect PDF to generate and download the encrypted PDF.',
    ],
    faqs: [
      {
        question: 'Is my password sent anywhere?',
        answer: 'No. Encryption happens 100% locally in your browser.',
      },
    ],
    relatedToolIds: ['unlock-pdf', 'password-generator', 'compress-pdf'],
    seoTitle: 'Protect PDF with Password – Encrypt PDF Online | Zenvi Tools',
    seoDescription: 'Add password protection to PDF files locally in your browser.',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'pdf',
    shortDescription: 'Remove owner restrictions or unlock authorized PDFs with their password.',
    fullDescription:
      'Remove printing/copying owner restrictions from authorized PDFs, or unlock a password-protected PDF when you know the open password.',
    supportedFormats: ['PDF'],
    instructions: [
      'Upload the PDF file you are authorized to unlock.',
      'If the PDF requires an open password, enter it in the password field.',
      'Click Unlock PDF to save an unrestricted copy.',
    ],
    faqs: [
      {
        question: 'Can this tool crack unknown user open passwords?',
        answer:
          'No. If a PDF is encrypted with a user open password, you must provide the valid password to decrypt it. Owner-only permission locks can be stripped directly.',
      },
    ],
    relatedToolIds: ['protect-pdf-with-password', 'merge-pdf', 'split-pdf'],
    seoTitle: 'Unlock PDF Online – Remove PDF Restrictions | Zenvi Tools',
    seoDescription: 'Unlock authorized PDF files and remove permission restrictions locally in your browser.',
  },

  // ==========================================
  // 2. CALCULATOR TOOLS (20)
  // ==========================================
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculators',
    shortDescription: 'Calculate percentages, percentage increases, decreases, and ratios.',
    fullDescription:
      'Solve common percentage problems in one place: find X% of Y, determine what percentage X is of Y, or calculate percentage change between two values.',
    popular: true,
    instructions: [
      'Choose the percentage calculation mode.',
      'Enter your numbers into the input fields.',
      'View the instant result and step-by-step formula.',
    ],
    examples: [
      { input: '15% of 240', output: '36' },
      { input: '45 is what % of 180', output: '25%' },
    ],
    faqs: [
      {
        question: 'How is percentage change calculated?',
        answer: 'Percentage change = ((New Value - Old Value) / |Old Value|) × 100.',
      },
    ],
    relatedToolIds: ['discount-calculator', 'tax-percentage-calculator', 'profit-and-loss-calculator'],
    seoTitle: 'Percentage Calculator – Fast & Accurate | Zenvi Tools',
    seoDescription: 'Calculate percentages, percentage of a number, and percentage change online.',
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculators',
    shortDescription: 'Calculate exact age in years, months, days, and total days.',
    fullDescription:
      'Find your exact chronological age from your date of birth to today or any custom target date, including next birthday countdown.',
    popular: true,
    instructions: [
      'Select your Date of Birth.',
      'Optionally change the "Age at Date" (defaults to today).',
      'View your exact age in years, months, days, and total days lived.',
    ],
    examples: [{ input: 'DOB: 1998-05-15', output: 'Exact years, months, and days' }],
    faqs: [
      {
        question: 'Does the Age Calculator account for leap years?',
        answer: 'Yes, it uses exact calendar month lengths and leap year rules.',
      },
    ],
    relatedToolIds: ['date-difference-calculator', 'time-duration-calculator'],
    seoTitle: 'Age Calculator – Exact Age in Years, Months & Days | Zenvi Tools',
    seoDescription: 'Calculate your exact age in years, months, and days from your date of birth.',
  },
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    category: 'calculators',
    shortDescription: 'Calculate semester Grade Point Average (GPA) with course credits.',
    fullDescription:
      'Compute your weighted semester GPA on a 4.0 scale by adding your courses, credit hours, and letter grades.',
    instructions: [
      'Add each course with its credit hours and letter grade (A+ through F).',
      'Add or remove course rows as needed.',
      'View your weighted GPA and total credit hours immediately.',
    ],
    examples: [{ input: '3 credits A (4.0) + 4 credits B+ (3.3)', output: '3.60 GPA' }],
    faqs: [
      {
        question: 'How is weighted GPA calculated?',
        answer: 'Total Grade Points (sum of Credit × Grade Value) divided by Total Credit Hours.',
      },
    ],
    relatedToolIds: ['cgpa-calculator', 'marksheet-percentage-calculator', 'average-calculator'],
    seoTitle: 'GPA Calculator – Semester Grade Point Average | Zenvi Tools',
    seoDescription: 'Calculate your semester GPA on a 4.0 scale with credit hours.',
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    category: 'calculators',
    shortDescription: 'Calculate cumulative GPA across multiple semesters and convert to percentage.',
    fullDescription:
      'Combine semester GPAs and credit hours to find your overall Cumulative Grade Point Average (CGPA) and approximate percentage equivalent.',
    instructions: [
      'Enter each semester’s GPA and total credits.',
      'Add more semesters if needed.',
      'View your cumulative CGPA and total credits.',
    ],
    faqs: [
      {
        question: 'Can I enter semesters with different credit totals?',
        answer: 'Yes, each semester is weighted by its credit hours.',
      },
    ],
    relatedToolIds: ['gpa-calculator', 'marksheet-percentage-calculator'],
    seoTitle: 'CGPA Calculator – Cumulative GPA Calculator | Zenvi Tools',
    seoDescription: 'Calculate your cumulative CGPA across multiple semesters.',
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'calculators',
    shortDescription: 'Calculate sale price and total savings after a percentage discount.',
    fullDescription:
      'Quickly find out how much you save and what you pay after applying a percentage discount (plus optional sales tax).',
    popular: true,
    instructions: [
      'Enter the original price.',
      'Enter the discount percentage (e.g., 25%).',
      'View the final price and exact amount saved.',
    ],
    examples: [{ input: '$120 with 25% off', output: 'Final: $90.00 (Saved $30.00)' }],
    faqs: [
      {
        question: 'Can I include sales tax after the discount?',
        answer: 'Yes, an optional tax field lets you see the final out-of-pocket total.',
      },
    ],
    relatedToolIds: ['percentage-calculator', 'tax-percentage-calculator', 'tip-calculator'],
    seoTitle: 'Discount Calculator – Sale Price & Savings | Zenvi Tools',
    seoDescription: 'Calculate discounted prices and savings percentages instantly.',
  },
  {
    id: 'profit-and-loss-calculator',
    name: 'Profit and Loss Calculator',
    category: 'calculators',
    shortDescription: 'Determine net profit, net loss, and profit/loss percentage.',
    fullDescription:
      'Compare Cost Price (CP) and Selling Price (SP) to immediately see whether a transaction resulted in a profit or loss and by what percentage.',
    instructions: [
      'Enter the Cost Price (CP).',
      'Enter the Selling Price (SP).',
      'View net profit or loss amount and percentage.',
    ],
    examples: [{ input: 'Cost: $80, Selling: $100', output: 'Profit: $20 (25%)' }],
    faqs: [
      {
        question: 'Is profit percentage based on cost price?',
        answer: 'Yes, standard profit % = ((SP - CP) / CP) × 100.',
      },
    ],
    relatedToolIds: ['percentage-calculator', 'discount-calculator', 'simple-interest-calculator'],
    seoTitle: 'Profit and Loss Calculator – Margin & Percentage | Zenvi Tools',
    seoDescription: 'Calculate profit, loss, and percentage margin from cost and selling price.',
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    category: 'calculators',
    shortDescription: 'Calculate simple interest and total maturity amount.',
    fullDescription:
      'Compute simple interest using Principal (P), Annual Interest Rate (R), and Time Period (T) in years or months.',
    instructions: [
      'Enter the principal amount.',
      'Enter the annual interest rate (%).',
      'Enter the time duration and select years or months.',
    ],
    examples: [{ input: '$1,000 at 5% for 3 years', output: 'Interest: $150, Total: $1,150' }],
    faqs: [
      {
        question: 'What is the Simple Interest formula?',
        answer: 'SI = (P × R × T) / 100, where T is in years.',
      },
    ],
    relatedToolIds: ['compound-interest-calculator', 'loan-emi-calculator'],
    seoTitle: 'Simple Interest Calculator – Online Interest Tool | Zenvi Tools',
    seoDescription: 'Calculate simple interest and total amount quickly and accurately.',
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    category: 'calculators',
    shortDescription: 'Calculate compound interest with customizable compounding frequency.',
    fullDescription:
      'See how investments or loans grow over time with annual, semi-annual, quarterly, monthly, or daily compounding.',
    popular: true,
    instructions: [
      'Enter principal amount, annual rate (%), and years.',
      'Select compounding frequency (Monthly, Quarterly, Annually, etc.).',
      'View total compound interest and final balance.',
    ],
    examples: [{ input: '$5,000 at 6% for 5 years (Monthly)', output: 'Total: $6,744.25' }],
    faqs: [
      {
        question: 'What formula is used?',
        answer: 'A = P(1 + r/n)^(nt), where n is the number of compounding periods per year.',
      },
    ],
    relatedToolIds: ['simple-interest-calculator', 'loan-emi-calculator'],
    seoTitle: 'Compound Interest Calculator – Investment Growth | Zenvi Tools',
    seoDescription: 'Calculate compound interest with monthly, quarterly, or annual compounding.',
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculators',
    shortDescription: 'Calculate Body Mass Index (BMI) in metric or imperial units.',
    fullDescription:
      'Compute your Body Mass Index (BMI) using kilograms/centimeters or pounds/feet-inches, along with standard WHO weight category ranges.',
    popular: true,
    instructions: [
      'Select Metric (kg, cm) or Imperial (lbs, ft/in).',
      'Enter your weight and height.',
      'View your BMI score and standard category.',
    ],
    examples: [{ input: '70 kg, 175 cm', output: 'BMI: 22.9 (Normal weight)' }],
    faqs: [
      {
        question: 'Is BMI a medical diagnosis?',
        answer: 'No, BMI is a general screening metric and does not directly measure body fat or muscle mass.',
      },
    ],
    relatedToolIds: ['age-calculator', 'unit-converter'],
    seoTitle: 'BMI Calculator – Metric & Imperial Body Mass Index | Zenvi Tools',
    seoDescription: 'Calculate your Body Mass Index (BMI) in metric or imperial units.',
  },
  {
    id: 'average-calculator',
    name: 'Average Calculator',
    category: 'calculators',
    shortDescription: 'Find mean, median, mode, range, and sum of any number list.',
    fullDescription:
      'Paste or type a list of numbers separated by commas, spaces, or new lines to compute the arithmetic mean, median, mode, min, max, and sum.',
    instructions: [
      'Enter numbers separated by commas, spaces, or line breaks.',
      'View the count, sum, mean (average), median, and range.',
    ],
    examples: [{ input: '10, 20, 30, 40, 50', output: 'Mean: 30, Median: 30, Sum: 150' }],
    faqs: [
      {
        question: 'How should I separate numbers?',
        answer: 'You can separate numbers with commas, spaces, or new lines.',
      },
    ],
    relatedToolIds: ['percentage-calculator', 'gpa-calculator', 'random-number-generator'],
    seoTitle: 'Average Calculator – Mean, Median, Mode & Sum | Zenvi Tools',
    seoDescription: 'Calculate mean, median, mode, sum, and range from any list of numbers.',
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio Calculator',
    category: 'calculators',
    shortDescription: 'Simplify ratios and solve proportional A:B = C:D equations.',
    fullDescription:
      'Simplify any two-part ratio to its lowest whole-number terms or solve for a missing value in an equivalent ratio.',
    instructions: [
      'Choose Simplify Ratio or Solve Proportion.',
      'Enter your numbers to see the simplified ratio or missing value.',
    ],
    examples: [{ input: '1920 : 1080', output: '16 : 9' }],
    faqs: [
      {
        question: 'How does ratio simplification work?',
        answer: 'Both sides are divided by their Greatest Common Divisor (GCD).',
      },
    ],
    relatedToolIds: ['fraction-calculator', 'percentage-calculator'],
    seoTitle: 'Ratio Calculator – Simplify & Solve Proportions | Zenvi Tools',
    seoDescription: 'Simplify ratios and solve proportional equations online.',
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    category: 'calculators',
    shortDescription: 'Add, subtract, multiply, and divide fractions with simplified results.',
    fullDescription:
      'Perform arithmetic on two fractions, automatically reducing the answer to its simplest form and showing mixed-number and decimal equivalents.',
    instructions: [
      'Enter numerator and denominator for both fractions.',
      'Select an operation (+, −, ×, ÷).',
      'View the simplified fraction, mixed number, and decimal value.',
    ],
    examples: [{ input: '1/2 + 1/3', output: '5/6 (0.8333)' }],
    faqs: [
      {
        question: 'Does it simplify improper fractions?',
        answer: 'Yes, it shows both the reduced improper fraction and the mixed number.',
      },
    ],
    relatedToolIds: ['ratio-calculator', 'percentage-calculator', 'scientific-calculator'],
    seoTitle: 'Fraction Calculator – Add, Subtract, Multiply & Divide | Zenvi Tools',
    seoDescription: 'Calculate and simplify fractions with step-by-step results.',
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    category: 'calculators',
    shortDescription: 'Calculate the exact number of days, weeks, months, and years between two dates.',
    fullDescription:
      'Find the exact duration between any two calendar dates, including total days, business days (weekdays), and calendar breakdown.',
    instructions: [
      'Select a Start Date and an End Date.',
      'View the exact difference in years, months, days, total days, and weekdays.',
    ],
    faqs: [
      {
        question: 'Does it count weekdays separately?',
        answer: 'Yes, it displays both total calendar days and Monday–Friday weekdays.',
      },
    ],
    relatedToolIds: ['age-calculator', 'time-duration-calculator'],
    seoTitle: 'Date Difference Calculator – Days Between Dates | Zenvi Tools',
    seoDescription: 'Calculate the exact number of days, weeks, and months between two dates.',
  },
  {
    id: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    category: 'calculators',
    shortDescription: 'Calculate hours, minutes, and seconds between two times.',
    fullDescription:
      'Compute the exact elapsed time between a start time and end time, with support for overnight shifts.',
    instructions: [
      'Enter Start Time and End Time.',
      'Toggle overnight mode if the end time is on the following day.',
      'View duration in hours, minutes, and total decimal hours.',
    ],
    examples: [{ input: '09:15 to 17:45', output: '8 hours 30 minutes (8.50 hrs)' }],
    faqs: [
      {
        question: 'Can it handle times that cross midnight?',
        answer: 'Yes, enable the "Crosses midnight" option for overnight shifts.',
      },
    ],
    relatedToolIds: ['date-difference-calculator', 'salary-calculator'],
    seoTitle: 'Time Duration Calculator – Hours & Minutes Elapsed | Zenvi Tools',
    seoDescription: 'Calculate elapsed hours and minutes between two times.',
  },
  {
    id: 'loan-emi-calculator',
    name: 'Loan EMI Calculator',
    category: 'calculators',
    shortDescription: 'Calculate monthly loan EMI, total interest, and total repayment.',
    fullDescription:
      'Plan home, auto, or personal loans by calculating your Equated Monthly Installment (EMI), total interest payable, and principal-to-interest breakdown.',
    popular: true,
    instructions: [
      'Enter the loan amount, annual interest rate (%), and tenure (years or months).',
      'View your monthly EMI, total interest, and total payment.',
    ],
    examples: [{ input: '$100,000 at 7.5% for 15 years', output: 'EMI: $927.01/mo' }],
    faqs: [
      {
        question: 'What is the EMI formula?',
        answer: 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where r is monthly interest rate and n is months.',
      },
    ],
    relatedToolIds: ['compound-interest-calculator', 'simple-interest-calculator', 'salary-calculator'],
    seoTitle: 'Loan EMI Calculator – Monthly Payment & Interest | Zenvi Tools',
    seoDescription: 'Calculate monthly loan EMI, total interest, and repayment schedule.',
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    category: 'calculators',
    shortDescription: 'Convert between hourly, daily, weekly, monthly, and annual salary.',
    fullDescription:
      'Instantly translate an hourly wage or annual salary into equivalent daily, weekly, bi-weekly, monthly, and annual figures based on your work hours per week.',
    instructions: [
      'Enter your pay amount and select its period (Hourly, Monthly, Annual, etc.).',
      'Adjust hours per week and weeks per year if needed.',
      'View the complete breakdown across all pay periods.',
    ],
    examples: [{ input: '$35/hour (40 hrs/wk)', output: '$72,800/year · $6,066.67/month' }],
    faqs: [
      {
        question: 'Does this calculate gross pay?',
        answer: 'Yes, it converts gross pay across periods. Use the Tax Percentage Calculator to estimate deductions.',
      },
    ],
    relatedToolIds: ['tax-percentage-calculator', 'time-duration-calculator', 'loan-emi-calculator'],
    seoTitle: 'Salary Calculator – Hourly to Annual Pay Converter | Zenvi Tools',
    seoDescription: 'Convert hourly, weekly, monthly, and annual salaries instantly.',
  },
  {
    id: 'tax-percentage-calculator',
    name: 'Tax Percentage Calculator',
    category: 'calculators',
    shortDescription: 'Add tax to a net price or extract tax from a tax-inclusive total.',
    fullDescription:
      'Calculate sales tax, VAT, or GST in both directions: add a tax rate to a base price, or reverse-calculate the pre-tax price from a gross total.',
    instructions: [
      'Choose "Add Tax" or "Remove (Extract) Tax".',
      'Enter the amount and tax percentage.',
      'View net amount, tax amount, and gross total.',
    ],
    examples: [{ input: '$100 + 8.5% tax', output: 'Tax: $8.50, Total: $108.50' }],
    faqs: [
      {
        question: 'How do you extract tax from a tax-inclusive price?',
        answer: 'Net Price = Gross Price / (1 + Tax Rate / 100).',
      },
    ],
    relatedToolIds: ['discount-calculator', 'percentage-calculator', 'tip-calculator'],
    seoTitle: 'Tax Percentage Calculator – Add or Extract VAT/GST/Sales Tax | Zenvi Tools',
    seoDescription: 'Add sales tax or extract tax from a gross total online.',
  },
  {
    id: 'tip-calculator',
    name: 'Tip Calculator',
    category: 'calculators',
    shortDescription: 'Calculate restaurant tip and split the total bill evenly.',
    fullDescription:
      'Quickly compute tip amount, total bill, and per-person share when dining out with a group.',
    instructions: [
      'Enter the bill subtotal.',
      'Select or enter a tip percentage (e.g., 15%, 18%, 20%).',
      'Set the number of people splitting the bill.',
    ],
    examples: [{ input: '$85 bill, 18% tip, 2 people', output: 'Tip: $15.30, Total: $100.30 ($50.15 each)' }],
    faqs: [
      {
        question: 'Can I split the bill among any number of people?',
        answer: 'Yes, enter any group size from 1 upward.',
      },
    ],
    relatedToolIds: ['percentage-calculator', 'discount-calculator', 'tax-percentage-calculator'],
    seoTitle: 'Tip Calculator – Split Bills & Calculate Gratuity | Zenvi Tools',
    seoDescription: 'Calculate tip amounts and split restaurant bills per person.',
  },
  {
    id: 'marksheet-percentage-calculator',
    name: 'Marksheet Percentage Calculator',
    category: 'calculators',
    shortDescription: 'Calculate total marks, overall percentage, and grade from subject scores.',
    fullDescription:
      'Enter obtained marks and maximum marks for each subject on your marksheet to compute total score, percentage, and pass/fail status.',
    instructions: [
      'Enter obtained marks and maximum marks for each subject.',
      'Add or remove subject rows as needed.',
      'View total marks, overall percentage, and grade classification.',
    ],
    examples: [{ input: '435 out of 500 total marks', output: '87.00%' }],
    faqs: [
      {
        question: 'Can different subjects have different maximum marks?',
        answer: 'Yes, each subject row has its own maximum marks field.',
      },
    ],
    relatedToolIds: ['gpa-calculator', 'cgpa-calculator', 'percentage-calculator'],
    seoTitle: 'Marksheet Percentage Calculator – Exam Score & % | Zenvi Tools',
    seoDescription: 'Calculate total marks and overall percentage from your subject marksheet.',
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    category: 'calculators',
    shortDescription: 'Perform trigonometric, logarithmic, exponential, and algebraic calculations.',
    fullDescription:
      'Full-featured scientific calculator supporting sin, cos, tan, log, ln, square root, powers, factorials, constants (π, e), and degree/radian modes.',
    popular: true,
    instructions: [
      'Use the keypad or your keyboard to enter mathematical expressions.',
      'Toggle between DEG (Degrees) and RAD (Radians) for trigonometry.',
      'Press = or Enter to evaluate.',
    ],
    examples: [{ input: 'sin(30) in DEG mode', output: '0.5' }],
    faqs: [
      {
        question: 'Does it support keyboard input?',
        answer: 'Yes, you can type numbers, operators (+, -, *, /), parentheses, and Enter.',
      },
    ],
    relatedToolIds: ['fraction-calculator', 'percentage-calculator', 'binary-to-decimal-converter'],
    seoTitle: 'Scientific Calculator Online – Trig, Log & Powers | Zenvi Tools',
    seoDescription: 'Free online scientific calculator with trigonometry, logarithms, roots, and DEG/RAD modes.',
  },

  // ==========================================
  // 3. IMAGE TOOLS (13)
  // ==========================================
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    shortDescription: 'Reduce JPG, PNG, and WEBP file sizes with adjustable quality.',
    fullDescription:
      'Compress images locally using HTML5 Canvas re-encoding. Preview the compressed image and compare before/after file sizes before downloading.',
    popular: true,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: [
      'Upload an image file.',
      'Adjust the quality slider (e.g., 75% for balanced size and clarity).',
      'Click Compress Image and download the smaller file.',
    ],
    faqs: [
      {
        question: 'Does compressing an image reduce its quality?',
        answer:
          'Lossy compression (JPG/WEBP) trades a small amount of visual detail for much smaller file sizes. PNG is lossless, so converting PNG to WEBP or JPG yields the largest size savings.',
      },
    ],
    relatedToolIds: ['multiple-images-compressor', 'image-resizer', 'webp-converter', 'compress-pdf'],
    seoTitle: 'Image Compressor Online – Reduce Image File Size | Zenvi Tools',
    seoDescription: 'Compress JPG, PNG, and WEBP images locally in your browser with live size comparison.',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    shortDescription: 'Resize images to exact pixel dimensions or percentage scale.',
    fullDescription:
      'Change the width and height of any image with optional aspect-ratio locking. Ideal for social media, websites, and email attachments.',
    popular: true,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: [
      'Upload an image.',
      'Enter target width and height (keep Aspect Ratio locked to prevent stretching).',
      'Click Resize Image and download the result.',
    ],
    faqs: [
      {
        question: 'How do I prevent my image from looking stretched?',
        answer: 'Keep the "Lock Aspect Ratio" checkbox enabled so height adjusts automatically when you change width.',
      },
    ],
    relatedToolIds: ['image-cropper', 'image-compressor', 'image-dimension-checker'],
    seoTitle: 'Image Resizer Online – Resize Photos by Pixels | Zenvi Tools',
    seoDescription: 'Resize JPG, PNG, and WEBP images to exact dimensions locally in your browser.',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    category: 'image',
    shortDescription: 'Convert JPG photographs into lossless PNG format.',
    fullDescription:
      'Convert JPG/JPEG files to PNG format directly in your browser. Useful when an application requires PNG uploads.',
    supportedFormats: ['JPG', 'JPEG', 'PNG'],
    instructions: [
      'Upload a JPG or JPEG image.',
      'Click Convert to PNG.',
      'Download your converted PNG file.',
    ],
    faqs: [
      {
        question: 'Will converting JPG to PNG make a blurry JPG sharper?',
        answer: 'No, PNG preserves the existing image without adding new compression artifacts, but it cannot restore detail already lost in the original JPG.',
      },
    ],
    relatedToolIds: ['png-to-jpg', 'jpg-to-webp', 'png-to-pdf'],
    seoTitle: 'JPG to PNG Converter – Free Online | Zenvi Tools',
    seoDescription: 'Convert JPG images to PNG format directly in your browser.',
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    category: 'image',
    shortDescription: 'Convert PNG images to smaller JPG files with custom background fill.',
    fullDescription:
      'Convert PNG images to JPG format. Because JPG does not support transparency, transparent areas are filled with a solid background color (white by default).',
    supportedFormats: ['PNG', 'JPG'],
    instructions: [
      'Upload a PNG image.',
      'Choose a background fill color for transparent areas and set JPG quality.',
      'Click Convert to JPG and download.',
    ],
    faqs: [
      {
        question: 'What happens to transparent backgrounds in PNG?',
        answer: 'JPG does not support alpha transparency, so transparent pixels are filled with your chosen background color (default white).',
      },
    ],
    relatedToolIds: ['jpg-to-png', 'png-to-webp', 'image-compressor'],
    seoTitle: 'PNG to JPG Converter – Online & Free | Zenvi Tools',
    seoDescription: 'Convert PNG images to JPG format with custom background color and quality control.',
  },
  {
    id: 'webp-converter',
    name: 'WEBP Converter',
    category: 'image',
    shortDescription: 'Convert images to or from WEBP format.',
    fullDescription:
      'Convert JPG or PNG images into modern WEBP format for faster websites, or convert WEBP images back into standard PNG or JPG.',
    supportedFormats: ['WEBP', 'JPG', 'PNG'],
    instructions: [
      'Upload any JPG, PNG, or WEBP image.',
      'Select your target output format (WEBP, PNG, or JPG) and quality.',
      'Click Convert and download.',
    ],
    faqs: [
      {
        question: 'Why use WEBP?',
        answer: 'WEBP typically produces 25–35% smaller files than JPG and PNG at comparable visual quality.',
      },
    ],
    relatedToolIds: ['png-to-webp', 'jpg-to-webp', 'webp-to-pdf'],
    seoTitle: 'WEBP Converter – Convert to & from WEBP | Zenvi Tools',
    seoDescription: 'Convert images to WEBP or convert WEBP to PNG and JPG online.',
  },
  {
    id: 'png-to-webp',
    name: 'PNG to WEBP',
    category: 'image',
    shortDescription: 'Convert PNG graphics to lightweight WEBP while preserving transparency.',
    fullDescription:
      'Shrink large PNG screenshots and transparent graphics by converting them to WEBP with alpha transparency intact.',
    supportedFormats: ['PNG', 'WEBP'],
    instructions: [
      'Upload a PNG image.',
      'Adjust quality if desired.',
      'Click Convert to WEBP and download.',
    ],
    faqs: [
      {
        question: 'Does PNG to WEBP keep transparent backgrounds?',
        answer: 'Yes, WEBP supports full alpha transparency.',
      },
    ],
    relatedToolIds: ['jpg-to-webp', 'webp-converter', 'image-compressor'],
    seoTitle: 'PNG to WEBP Converter – Keep Transparency | Zenvi Tools',
    seoDescription: 'Convert PNG images to WEBP format while preserving transparency.',
  },
  {
    id: 'jpg-to-webp',
    name: 'JPG to WEBP',
    category: 'image',
    shortDescription: 'Convert JPG photos into modern, web-optimized WEBP images.',
    fullDescription:
      'Reduce website page weight by converting JPG photographs into WEBP format with adjustable compression quality.',
    supportedFormats: ['JPG', 'JPEG', 'WEBP'],
    instructions: [
      'Upload a JPG/JPEG image.',
      'Set your preferred quality level.',
      'Click Convert to WEBP and download.',
    ],
    faqs: [
      {
        question: 'Are WEBP images supported in modern browsers?',
        answer: 'Yes, all modern versions of Chrome, Safari, Firefox, Edge, and Android/iOS browsers support WEBP.',
      },
    ],
    relatedToolIds: ['png-to-webp', 'webp-converter', 'image-compressor'],
    seoTitle: 'JPG to WEBP Converter – Web Image Optimizer | Zenvi Tools',
    seoDescription: 'Convert JPG photos to WEBP format locally in your browser.',
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    category: 'image',
    shortDescription: 'Crop images to custom dimensions or standard aspect ratios.',
    fullDescription:
      'Trim unwanted edges from photos using preset aspect ratios (1:1, 16:9, 4:3, Free) or exact pixel coordinates.',
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: [
      'Upload an image.',
      'Select an aspect ratio preset or adjust crop X, Y, Width, and Height.',
      'Preview the crop region and click Crop & Download.',
    ],
    faqs: [
      {
        question: 'Can I crop an image to a 1:1 square?',
        answer: 'Yes, click the 1:1 Square preset to automatically center a square crop.',
      },
    ],
    relatedToolIds: ['image-resizer', 'image-rotator', 'image-dimension-checker'],
    seoTitle: 'Image Cropper Online – Crop Photos Easily | Zenvi Tools',
    seoDescription: 'Crop JPG, PNG, and WEBP images to custom dimensions or aspect ratios.',
  },
  {
    id: 'image-rotator',
    name: 'Image Rotator',
    category: 'image',
    shortDescription: 'Rotate images by 90°, 180°, 270° or flip horizontally and vertically.',
    fullDescription:
      'Fix sideways photos or mirror images horizontally/vertically with instant preview and lossless-dimension canvas rendering.',
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: [
      'Upload an image.',
      'Click Rotate Left, Rotate Right, Flip Horizontal, or Flip Vertical.',
      'Download the rotated image.',
    ],
    faqs: [
      {
        question: 'Can I combine rotation and flipping?',
        answer: 'Yes, you can apply any combination of 90-degree rotations and flips before downloading.',
      },
    ],
    relatedToolIds: ['image-cropper', 'image-resizer', 'rotate-pdf'],
    seoTitle: 'Image Rotator & Flipper Online | Zenvi Tools',
    seoDescription: 'Rotate and flip JPG, PNG, and WEBP images directly in your browser.',
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    category: 'image',
    shortDescription: 'Convert any JPG, PNG, or WEBP image into a PDF document.',
    fullDescription:
      'Quickly turn any single or multiple images into a clean PDF document with customizable page size and margins.',
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'PDF'],
    instructions: [
      'Upload one or more images.',
      'Select page size and orientation.',
      'Click Convert to PDF and download.',
    ],
    faqs: [
      {
        question: 'Which image formats are supported?',
        answer: 'JPG, JPEG, PNG, and WEBP are all supported.',
      },
    ],
    relatedToolIds: ['multiple-images-to-pdf', 'jpg-to-pdf', 'png-to-pdf'],
    seoTitle: 'Image to PDF Converter – All Image Formats | Zenvi Tools',
    seoDescription: 'Convert JPG, PNG, and WEBP images to PDF documents online.',
  },
  {
    id: 'image-dimension-checker',
    name: 'Image Dimension Checker',
    category: 'image',
    shortDescription: 'Inspect exact pixel width, height, aspect ratio, and megapixels.',
    fullDescription:
      'Check the exact width, height, simplified aspect ratio, orientation, and megapixel count of any image without uploading it.',
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG'],
    instructions: [
      'Select or drop any image file.',
      'View its exact pixel dimensions, aspect ratio, and megapixels immediately.',
    ],
    faqs: [
      {
        question: 'Does this check SVG dimensions too?',
        answer: 'Yes, it reads the rendered natural width and height of any browser-supported image.',
      },
    ],
    relatedToolIds: ['image-file-size-checker', 'image-resizer', 'image-cropper'],
    seoTitle: 'Image Dimension Checker – Check Width, Height & Aspect Ratio | Zenvi Tools',
    seoDescription: 'Check exact pixel width, height, and aspect ratio of any image online.',
  },
  {
    id: 'image-file-size-checker',
    name: 'Image File Size Checker',
    category: 'image',
    shortDescription: 'Check exact file size in Bytes, KB, and MB along with image metadata.',
    fullDescription:
      'Inspect the exact byte size, KB, MB, MIME type, and dimensions of one or multiple image files.',
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG'],
    instructions: [
      'Upload one or more image files.',
      'View exact file sizes in Bytes, KB, and MB.',
    ],
    faqs: [
      {
        question: 'Can I check multiple images at once?',
        answer: 'Yes, upload multiple images to compare their file sizes side by side.',
      },
    ],
    relatedToolIds: ['image-dimension-checker', 'image-compressor', 'multiple-images-compressor'],
    seoTitle: 'Image File Size Checker – Check KB & MB Online | Zenvi Tools',
    seoDescription: 'Check the exact file size in KB and MB of your images locally.',
  },
  {
    id: 'multiple-images-compressor',
    name: 'Multiple Images Compressor',
    category: 'image',
    shortDescription: 'Batch-compress multiple images at once and download as a ZIP.',
    fullDescription:
      'Compress dozens of JPG, PNG, or WEBP images simultaneously in your browser and download them all in one convenient ZIP archive.',
    recentlyAdded: true,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'ZIP'],
    instructions: [
      'Select or drop multiple image files.',
      'Set your target quality and output format.',
      'Click Compress All and download the ZIP archive.',
    ],
    faqs: [
      {
        question: 'How are batch-compressed images delivered?',
        answer: 'All compressed images are packaged into a single .zip file for one-click download.',
      },
    ],
    relatedToolIds: ['image-compressor', 'multiple-images-to-pdf', 'image-file-size-checker'],
    seoTitle: 'Multiple Images Compressor – Batch Compress to ZIP | Zenvi Tools',
    seoDescription: 'Batch-compress multiple JPG, PNG, and WEBP images and download as a ZIP.',
  },

  // ==========================================
  // 4. TEXT TOOLS (14)
  // ==========================================
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    shortDescription: 'Count words, characters, sentences, paragraphs, and reading time.',
    fullDescription:
      'Real-time text analysis tool that counts words, characters (with and without spaces), sentences, paragraphs, and estimated reading/speaking time.',
    popular: true,
    instructions: [
      'Type or paste your text into the editor.',
      'View live word, character, sentence, and paragraph counts.',
    ],
    faqs: [
      {
        question: 'How is reading time estimated?',
        answer: 'Reading time is calculated at an average adult reading speed of 200 words per minute.',
      },
    ],
    relatedToolIds: ['character-counter', 'sentence-counter', 'paragraph-counter', 'reading-time-calculator'],
    seoTitle: 'Word Counter Online – Count Words & Characters | Zenvi Tools',
    seoDescription: 'Count words, characters, sentences, paragraphs, and reading time in real time.',
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    category: 'text',
    shortDescription: 'Count total characters, characters without spaces, and byte length.',
    fullDescription:
      'Check exact character counts for social media posts, SEO meta descriptions, SMS messages, and form fields.',
    instructions: [
      'Paste or type your text.',
      'View characters with spaces, without spaces, and UTF-8 byte size.',
    ],
    faqs: [
      {
        question: 'Why does UTF-8 byte count matter?',
        answer: 'Emojis and non-ASCII characters take 2–4 bytes in UTF-8, which matters for database and SMS limits.',
      },
    ],
    relatedToolIds: ['word-counter', 'sentence-counter', 'remove-extra-spaces'],
    seoTitle: 'Character Counter Online – With & Without Spaces | Zenvi Tools',
    seoDescription: 'Count characters with and without spaces plus UTF-8 byte length.',
  },
  {
    id: 'sentence-counter',
    name: 'Sentence Counter',
    category: 'text',
    shortDescription: 'Count sentences and average words per sentence.',
    fullDescription:
      'Analyze sentence count and average sentence length to improve readability and writing flow.',
    instructions: [
      'Paste your article or essay.',
      'View total sentences and average words per sentence.',
    ],
    faqs: [
      {
        question: 'How are sentences detected?',
        answer: 'Sentences are split by terminal punctuation marks (. ! ?) followed by whitespace or end of text.',
      },
    ],
    relatedToolIds: ['word-counter', 'paragraph-counter', 'reading-time-calculator'],
    seoTitle: 'Sentence Counter Online – Analyze Sentence Length | Zenvi Tools',
    seoDescription: 'Count sentences and check average sentence length in your text.',
  },
  {
    id: 'paragraph-counter',
    name: 'Paragraph Counter',
    category: 'text',
    shortDescription: 'Count non-empty paragraphs and average words per paragraph.',
    fullDescription:
      'Check the number of paragraphs in your document and see average paragraph length.',
    instructions: [
      'Paste your text into the box.',
      'View total non-empty paragraphs and word distribution.',
    ],
    faqs: [
      {
        question: 'Are blank lines counted as paragraphs?',
        answer: 'No, only non-empty text blocks separated by line breaks are counted.',
      },
    ],
    relatedToolIds: ['word-counter', 'sentence-counter', 'remove-duplicate-lines'],
    seoTitle: 'Paragraph Counter Online – Count Paragraphs | Zenvi Tools',
    seoDescription: 'Count paragraphs and average paragraph length in any text.',
  },
  {
    id: 'uppercase-converter',
    name: 'Uppercase Converter',
    category: 'text',
    shortDescription: 'Convert all text characters to UPPERCASE.',
    fullDescription:
      'Instantly transform lowercase or mixed-case text into ALL CAPS with one-click copy.',
    instructions: [
      'Paste or type your text.',
      'Copy the converted UPPERCASE output.',
    ],
    faqs: [
      {
        question: 'Does it affect numbers or punctuation?',
        answer: 'No, numbers and punctuation remain unchanged.',
      },
    ],
    relatedToolIds: ['lowercase-converter', 'title-case-converter', 'text-cleaner'],
    seoTitle: 'Uppercase Converter – Convert Text to ALL CAPS | Zenvi Tools',
    seoDescription: 'Convert any text to uppercase letters online.',
  },
  {
    id: 'lowercase-converter',
    name: 'Lowercase Converter',
    category: 'text',
    shortDescription: 'Convert all text characters to lowercase.',
    fullDescription:
      'Quickly convert shouting ALL CAPS or mixed-case text into clean lowercase.',
    instructions: [
      'Paste or type your text.',
      'Copy the converted lowercase output.',
    ],
    faqs: [
      {
        question: 'Is there a character limit?',
        answer: 'No, it handles large blocks of text instantaneously.',
      },
    ],
    relatedToolIds: ['uppercase-converter', 'title-case-converter', 'text-cleaner'],
    seoTitle: 'Lowercase Converter – Convert Text to lowercase | Zenvi Tools',
    seoDescription: 'Convert uppercase or mixed-case text to lowercase online.',
  },
  {
    id: 'title-case-converter',
    name: 'Title Case Converter',
    category: 'text',
    shortDescription: 'Capitalize headlines and titles using standard title case rules.',
    fullDescription:
      'Format blog titles, headings, and book names by capitalizing major words while keeping minor articles and prepositions lowercase (except at the start/end).',
    instructions: [
      'Enter your headline or title.',
      'Copy the formatted Title Case text.',
    ],
    examples: [{ input: 'the quick brown fox jumps over the lazy dog', output: 'The Quick Brown Fox Jumps Over the Lazy Dog' }],
    faqs: [
      {
        question: 'Which words stay lowercase in Title Case?',
        answer: 'Short articles, conjunctions, and prepositions (a, an, the, and, but, for, in, of, on, to) stay lowercase unless they are the first or last word.',
      },
    ],
    relatedToolIds: ['uppercase-converter', 'lowercase-converter', 'word-counter'],
    seoTitle: 'Title Case Converter – Capitalize Headlines Properly | Zenvi Tools',
    seoDescription: 'Convert headlines and titles to proper Title Case online.',
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    category: 'text',
    shortDescription: 'Strip double spaces, tabs, and leading/trailing whitespace.',
    fullDescription:
      'Clean up messy copy-pasted text by collapsing multiple spaces into single spaces and trimming line edges.',
    instructions: [
      'Paste text with extra spaces or tabs.',
      'Click Clean Spaces and copy the normalized text.',
    ],
    faqs: [
      {
        question: 'Does it preserve paragraph line breaks?',
        answer: 'Yes, you can choose whether to preserve single line breaks or collapse everything into one line.',
      },
    ],
    relatedToolIds: ['text-cleaner', 'remove-duplicate-lines', 'character-counter'],
    seoTitle: 'Remove Extra Spaces Online – Clean Whitespace | Zenvi Tools',
    seoDescription: 'Remove multiple spaces, tabs, and extra whitespace from text.',
  },
  {
    id: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    category: 'text',
    shortDescription: 'Deduplicate lists and remove repeated lines of text.',
    fullDescription:
      'Filter out duplicate lines from lists, logs, or email exports, with options for case-sensitive matching and alphabetical sorting.',
    instructions: [
      'Paste your list of lines.',
      'Toggle case-sensitivity or sorting if needed.',
      'Copy the deduplicated list.',
    ],
    faqs: [
      {
        question: 'Does it keep the first occurrence of each line?',
        answer: 'Yes, the original order of first appearances is preserved unless you enable alphabetical sorting.',
      },
    ],
    relatedToolIds: ['remove-extra-spaces', 'text-cleaner', 'paragraph-counter'],
    seoTitle: 'Remove Duplicate Lines Online – Deduplicate Lists | Zenvi Tools',
    seoDescription: 'Remove duplicate lines from any text list quickly and privately.',
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    category: 'text',
    shortDescription: 'Reverse text by characters, by words, or by lines.',
    fullDescription:
      'Flip text backwards character-by-character, reverse word order, or reverse line order.',
    instructions: [
      'Enter your text.',
      'Choose Reverse Characters, Reverse Words, or Reverse Lines.',
      'Copy the reversed output.',
    ],
    examples: [{ input: 'Zenvi Tools', output: 'slooT ivneZ' }],
    faqs: [
      {
        question: 'Does it handle emojis properly?',
        answer: 'Yes, it uses Unicode code-point splitting so emojis are not corrupted.',
      },
    ],
    relatedToolIds: ['uppercase-converter', 'base64-encoder', 'password-generator'],
    seoTitle: 'Text Reverser Online – Reverse Characters & Words | Zenvi Tools',
    seoDescription: 'Reverse text by characters, words, or lines online.',
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    category: 'text',
    shortDescription: 'Listen to any text read aloud using your browser’s speech engine.',
    fullDescription:
      'Convert written text into spoken audio using the Web Speech API built into your browser. Adjust voice, speaking rate, and pitch.',
    popular: true,
    instructions: [
      'Type or paste the text you want to hear.',
      'Select an available system voice, speed, and pitch.',
      'Click Speak to listen, or Pause/Stop at any time.',
    ],
    faqs: [
      {
        question: 'What if my browser does not support Text to Speech?',
        answer: 'If window.speechSynthesis is unavailable in your browser, the tool will clearly notify you.',
      },
    ],
    relatedToolIds: ['reading-time-calculator', 'word-counter', 'lorem-ipsum-generator'],
    seoTitle: 'Text to Speech Online – Free Browser Voice Reader | Zenvi Tools',
    seoDescription: 'Read text aloud with adjustable voices, speed, and pitch using your browser.',
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'text',
    shortDescription: 'Generate placeholder paragraphs, sentences, or words for design mockups.',
    fullDescription:
      'Create classic Lorem Ipsum placeholder text by paragraph, sentence, or word count for layouts and typography testing.',
    instructions: [
      'Choose Paragraphs, Sentences, or Words.',
      'Set the desired count.',
      'Click Generate and copy the placeholder text.',
    ],
    faqs: [
      {
        question: 'Can I start with the classic "Lorem ipsum dolor sit amet"?',
        answer: 'Yes, you can toggle whether the generated text starts with the traditional opening.',
      },
    ],
    relatedToolIds: ['word-counter', 'character-counter', 'random-number-generator'],
    seoTitle: 'Lorem Ipsum Generator – Placeholder Text | Zenvi Tools',
    seoDescription: 'Generate Lorem Ipsum paragraphs, sentences, and words for design and layout.',
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner',
    category: 'text',
    shortDescription: 'Strip HTML tags, extra spaces, blank lines, and special characters.',
    fullDescription:
      'All-in-one text sanitizer to remove HTML tags, collapse extra spaces, delete empty lines, and normalize line breaks.',
    instructions: [
      'Paste messy text or HTML.',
      'Select the cleaning rules you want to apply.',
      'Copy the clean plain-text output.',
    ],
    faqs: [
      {
        question: 'Can it strip HTML tags safely?',
        answer: 'Yes, it parses and extracts plain text without executing any scripts.',
      },
    ],
    relatedToolIds: ['remove-extra-spaces', 'remove-duplicate-lines', 'lowercase-converter'],
    seoTitle: 'Text Cleaner Online – Strip HTML & Format Text | Zenvi Tools',
    seoDescription: 'Clean messy text by removing HTML tags, blank lines, and extra spaces.',
  },
  {
    id: 'reading-time-calculator',
    name: 'Reading Time Calculator',
    category: 'text',
    shortDescription: 'Estimate reading and speaking time for articles and scripts.',
    fullDescription:
      'Calculate how long it takes to read or speak your text at slow, average (200 WPM), or fast reading speeds.',
    instructions: [
      'Paste your article, blog post, or speech script.',
      'Adjust words-per-minute (WPM) if desired.',
      'View exact reading and speaking durations.',
    ],
    faqs: [
      {
        question: 'What is the average speaking speed?',
        answer: 'Conversational speaking is typically around 130–150 words per minute.',
      },
    ],
    relatedToolIds: ['word-counter', 'sentence-counter', 'text-to-speech'],
    seoTitle: 'Reading Time Calculator – Article & Speech Duration | Zenvi Tools',
    seoDescription: 'Estimate reading and speaking time for any text based on word count.',
  },

  // ==========================================
  // 5. QR & OTHER USEFUL TOOLS (20)
  // ==========================================
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'qr-other',
    shortDescription: 'Create custom QR codes for text, links, or notes and download as PNG or SVG.',
    fullDescription:
      'Generate crisp, scannable QR codes with customizable foreground/background colors, size, and error correction level.',
    popular: true,
    instructions: [
      'Enter any text, URL, or message.',
      'Customize size, colors, and error correction level.',
      'Download your QR code as a PNG or SVG file.',
    ],
    faqs: [
      {
        question: 'Do generated QR codes expire?',
        answer: 'No. Static QR codes encode your data directly in the pattern and never expire.',
      },
    ],
    relatedToolIds: ['url-qr-generator', 'wifi-qr-generator', 'contact-qr-generator', 'qr-code-scanner'],
    seoTitle: 'QR Code Generator – Free PNG & SVG QR Codes | Zenvi Tools',
    seoDescription: 'Generate custom QR codes for free and download in PNG or SVG format.',
  },
  {
    id: 'qr-code-scanner',
    name: 'QR Code Scanner',
    category: 'qr-other',
    shortDescription: 'Scan QR codes using your device camera or by uploading an image.',
    fullDescription:
      'Decode QR codes locally using your webcam/phone camera (permission requested only when you click Start Camera) or by uploading a screenshot/photo.',
    popular: true,
    instructions: [
      'Click "Start Camera" to scan live, or upload an image containing a QR code.',
      'View the decoded text or URL immediately.',
      'Copy the result or open the link.',
    ],
    faqs: [
      {
        question: 'Does the scanner request camera access automatically?',
        answer: 'No, camera permission is only requested when you explicitly click "Start Camera". You can also upload an image instead.',
      },
    ],
    relatedToolIds: ['qr-code-generator', 'url-qr-generator', 'wifi-qr-generator'],
    seoTitle: 'QR Code Scanner Online – Camera & Image Upload | Zenvi Tools',
    seoDescription: 'Scan QR codes online using your camera or by uploading an image.',
  },
  {
    id: 'wifi-qr-generator',
    name: 'Wi-Fi QR Generator',
    category: 'qr-other',
    shortDescription: 'Create a scannable Wi-Fi QR code so guests can join without typing passwords.',
    fullDescription:
      'Generate a standard WIFI: QR code for WPA/WPA2/WPA3, WEP, or open networks. Works with iPhone and Android cameras.',
    popular: true,
    instructions: [
      'Enter your Wi-Fi Network Name (SSID) and Password.',
      'Select security type (WPA/WPA2 is standard).',
      'Download the Wi-Fi QR code to print or share.',
    ],
    faqs: [
      {
        question: 'Is my Wi-Fi password sent to any server?',
        answer: 'No, the QR code is generated 100% locally in your browser.',
      },
    ],
    relatedToolIds: ['qr-code-generator', 'password-generator', 'qr-code-scanner'],
    seoTitle: 'Wi-Fi QR Code Generator – Share Wi-Fi Easily | Zenvi Tools',
    seoDescription: 'Generate a scannable Wi-Fi QR code for iPhone and Android.',
  },
  {
    id: 'url-qr-generator',
    name: 'URL QR Generator',
    category: 'qr-other',
    shortDescription: 'Generate a dedicated QR code for any website URL.',
    fullDescription:
      'Turn any web address into a clean, high-contrast QR code ready for print, flyers, or digital sharing.',
    instructions: [
      'Paste your website URL (including https://).',
      'Customize colors and size.',
      'Download as PNG or SVG.',
    ],
    faqs: [
      {
        question: 'Should I include https:// in the URL?',
        answer: 'Yes, including https:// ensures phones recognize it immediately as a clickable web link.',
      },
    ],
    relatedToolIds: ['qr-code-generator', 'wifi-qr-generator', 'contact-qr-generator'],
    seoTitle: 'URL QR Code Generator – Website Link to QR | Zenvi Tools',
    seoDescription: 'Convert any website URL into a downloadable PNG or SVG QR code.',
  },
  {
    id: 'contact-qr-generator',
    name: 'Contact QR Generator',
    category: 'qr-other',
    shortDescription: 'Create a vCard QR code to share your contact details in one scan.',
    fullDescription:
      'Generate a standard vCard 3.0 QR code containing your name, phone number, email, organization, and website.',
    recentlyAdded: true,
    instructions: [
      'Fill in your contact fields (Name, Phone, Email, Company, Website).',
      'Download the vCard QR code as PNG or SVG.',
    ],
    faqs: [
      {
        question: 'What happens when someone scans a Contact QR code?',
        answer: 'Their phone prompts them to save your contact card directly to their address book.',
      },
    ],
    relatedToolIds: ['qr-code-generator', 'url-qr-generator', 'wifi-qr-generator'],
    seoTitle: 'Contact QR Code Generator – vCard QR | Zenvi Tools',
    seoDescription: 'Create a scannable vCard contact QR code for business cards and profiles.',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'qr-other',
    shortDescription: 'Generate cryptographically strong, random passwords.',
    fullDescription:
      'Create secure random passwords using window.crypto.getRandomValues() with customizable length and character sets.',
    popular: true,
    instructions: [
      'Choose password length (8 to 64 characters).',
      'Select character types (Uppercase, Lowercase, Numbers, Symbols).',
      'Click Generate and copy your password.',
    ],
    faqs: [
      {
        question: 'How random are the generated passwords?',
        answer: 'They use the browser’s cryptographically secure pseudo-random number generator (crypto.getRandomValues).',
      },
    ],
    relatedToolIds: ['random-number-generator', 'protect-pdf-with-password', 'wifi-qr-generator'],
    seoTitle: 'Strong Password Generator – Secure Random Passwords | Zenvi Tools',
    seoDescription: 'Generate secure, random passwords locally using cryptographic randomness.',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'qr-other',
    shortDescription: 'Convert between length, weight, temperature, area, volume, and speed.',
    fullDescription:
      'All-in-one unit converter supporting metric and imperial measurements across multiple physical categories.',
    popular: true,
    instructions: [
      'Select a measurement category (Length, Weight, Temperature, Volume, Speed).',
      'Enter a value and choose source and target units.',
      'View the instant converted result.',
    ],
    faqs: [
      {
        question: 'Are conversions exact?',
        answer: 'Yes, standard international conversion factors are used.',
      },
    ],
    relatedToolIds: ['length-converter', 'weight-converter', 'temperature-converter'],
    seoTitle: 'Unit Converter Online – Metric & Imperial | Zenvi Tools',
    seoDescription: 'Convert length, weight, temperature, volume, and speed units online.',
  },
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    category: 'qr-other',
    shortDescription: 'Convert between Celsius (°C), Fahrenheit (°F), and Kelvin (K).',
    fullDescription:
      'Instantly convert temperatures between Celsius, Fahrenheit, and Kelvin with exact formulas.',
    instructions: [
      'Enter a temperature value.',
      'Select the input unit (°C, °F, or K).',
      'View all three temperature scales simultaneously.',
    ],
    examples: [{ input: '100 °C', output: '212 °F · 373.15 K' }],
    faqs: [
      {
        question: 'How is Celsius converted to Fahrenheit?',
        answer: '°F = (°C × 9/5) + 32.',
      },
    ],
    relatedToolIds: ['unit-converter', 'length-converter', 'weight-converter'],
    seoTitle: 'Temperature Converter – Celsius, Fahrenheit & Kelvin | Zenvi Tools',
    seoDescription: 'Convert between Celsius, Fahrenheit, and Kelvin temperatures.',
  },
  {
    id: 'length-converter',
    name: 'Length Converter',
    category: 'qr-other',
    shortDescription: 'Convert meters, kilometers, miles, feet, inches, yards, and centimeters.',
    fullDescription:
      'Convert metric and imperial distance and length units with high precision.',
    instructions: [
      'Enter a length value.',
      'Select From and To units (e.g., Kilometers to Miles).',
      'View the converted value.',
    ],
    examples: [{ input: '5 Kilometers', output: '3.10686 Miles' }],
    faqs: [
      {
        question: 'How many centimeters are in an inch?',
        answer: '1 inch is exactly 2.54 centimeters.',
      },
    ],
    relatedToolIds: ['unit-converter', 'weight-converter', 'temperature-converter'],
    seoTitle: 'Length Converter – Meters, Feet, Inches & Miles | Zenvi Tools',
    seoDescription: 'Convert between metric and imperial length and distance units.',
  },
  {
    id: 'weight-converter',
    name: 'Weight Converter',
    category: 'qr-other',
    shortDescription: 'Convert kilograms, grams, pounds, ounces, and metric tons.',
    fullDescription:
      'Convert mass and weight units between metric (kg, g, mg, t) and imperial (lb, oz, st) systems.',
    instructions: [
      'Enter a weight value.',
      'Choose source and target weight units.',
      'View the converted result.',
    ],
    examples: [{ input: '10 Kilograms', output: '22.0462 Pounds' }],
    faqs: [
      {
        question: 'How many grams are in a pound?',
        answer: '1 avoirdupois pound is 453.59237 grams.',
      },
    ],
    relatedToolIds: ['unit-converter', 'length-converter', 'bmi-calculator'],
    seoTitle: 'Weight Converter – Kilograms, Pounds & Ounces | Zenvi Tools',
    seoDescription: 'Convert kilograms, grams, pounds, and ounces online.',
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    category: 'qr-other',
    shortDescription: 'Convert world currencies using live European Central Bank reference rates.',
    fullDescription:
      'Convert between major global currencies using the free, open-source Frankfurter exchange-rate API (European Central Bank reference rates), with the exact rate date clearly displayed.',
    popular: true,
    instructions: [
      'Enter the amount to convert.',
      'Select your source currency and target currency.',
      'View the converted amount and the official rate date.',
    ],
    faqs: [
      {
        question: 'Where do the exchange rates come from?',
        answer: 'Rates are fetched from the public Frankfurter API (api.frankfurter.app), which publishes European Central Bank reference rates.',
      },
    ],
    relatedToolIds: ['percentage-calculator', 'discount-calculator', 'unit-converter'],
    seoTitle: 'Currency Converter – Live Reference Exchange Rates | Zenvi Tools',
    seoDescription: 'Convert global currencies using live European Central Bank reference rates.',
  },
  {
    id: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    category: 'qr-other',
    shortDescription: 'Convert between standard numbers (1–3999) and Roman numerals.',
    fullDescription:
      'Translate Arabic integers (1 to 3999) into Roman numerals (I, V, X, L, C, D, M) and vice versa.',
    instructions: [
      'Enter a number (1–3999) or a Roman numeral (e.g., MMXXVI).',
      'View the instant conversion.',
    ],
    examples: [{ input: '2026', output: 'MMXXVI' }],
    faqs: [
      {
        question: 'Why is the standard range 1 to 3999?',
        answer: 'Standard Roman numerals represent values from 1 (I) up to 3999 (MMMCMXCIX) without overline notation.',
      },
    ],
    relatedToolIds: ['number-to-words-converter', 'binary-to-decimal-converter'],
    seoTitle: 'Roman Numeral Converter – Numbers to Roman Numerals | Zenvi Tools',
    seoDescription: 'Convert numbers to Roman numerals and Roman numerals to numbers.',
  },
  {
    id: 'number-to-words-converter',
    name: 'Number to Words Converter',
    category: 'qr-other',
    shortDescription: 'Spell out numbers into English words (e.g., 1,250 → One Thousand Two Hundred Fifty).',
    fullDescription:
      'Convert integers and decimals into written English words for checks, legal documents, and invoices.',
    instructions: [
      'Enter any number.',
      'View and copy the written English words.',
    ],
    examples: [{ input: '1450', output: 'one thousand four hundred fifty' }],
    faqs: [
      {
        question: 'Does it support negative numbers and decimals?',
        answer: 'Yes, negative numbers and decimal digits are both supported.',
      },
    ],
    relatedToolIds: ['roman-numeral-converter', 'currency-converter'],
    seoTitle: 'Number to Words Converter – Spell Out Numbers | Zenvi Tools',
    seoDescription: 'Convert numbers into written English words online.',
  },
  {
    id: 'binary-to-decimal-converter',
    name: 'Binary to Decimal Converter',
    category: 'qr-other',
    shortDescription: 'Convert binary (base-2) numbers to decimal (base-10) and hexadecimal.',
    fullDescription:
      'Translate binary strings (0s and 1s) into decimal, hexadecimal, and octal values with bit-by-bit breakdown.',
    instructions: [
      'Enter a binary number (e.g., 101101).',
      'View the decimal, hex, and octal equivalents.',
    ],
    examples: [{ input: '101010', output: 'Decimal: 42 (Hex: 2A)' }],
    faqs: [
      {
        question: 'What characters are valid in binary?',
        answer: 'Only 0 and 1 (spaces between bytes are automatically ignored).',
      },
    ],
    relatedToolIds: ['decimal-to-binary-converter', 'base64-encoder', 'scientific-calculator'],
    seoTitle: 'Binary to Decimal Converter – Base-2 to Base-10 | Zenvi Tools',
    seoDescription: 'Convert binary numbers to decimal and hexadecimal online.',
  },
  {
    id: 'decimal-to-binary-converter',
    name: 'Decimal to Binary Converter',
    category: 'qr-other',
    shortDescription: 'Convert decimal (base-10) integers to binary (base-2) and hex.',
    fullDescription:
      'Convert standard base-10 integers into binary (base-2), hexadecimal (base-16), and octal (base-8).',
    instructions: [
      'Enter a non-negative decimal integer.',
      'View the binary, hex, and octal representations.',
    ],
    examples: [{ input: '255', output: 'Binary: 11111111 (Hex: FF)' }],
    faqs: [
      {
        question: 'Can I copy the binary output?',
        answer: 'Yes, click Copy to copy the binary string.',
      },
    ],
    relatedToolIds: ['binary-to-decimal-converter', 'base64-encoder'],
    seoTitle: 'Decimal to Binary Converter – Base-10 to Base-2 | Zenvi Tools',
    seoDescription: 'Convert decimal numbers to binary, hexadecimal, and octal.',
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    category: 'qr-other',
    shortDescription: 'Encode plain text or UTF-8 strings into Base64 format.',
    fullDescription:
      'Safely encode text (including Unicode and emojis) into Base64 strings directly in your browser.',
    instructions: [
      'Enter or paste your plain text.',
      'Copy the Base64-encoded output.',
    ],
    examples: [{ input: 'Zenvi Tools', output: 'WmVudmkgVG9vbHM=' }],
    faqs: [
      {
        question: 'Does it support UTF-8 characters like emojis?',
        answer: 'Yes, it uses TextEncoder to properly encode UTF-8 bytes before Base64 conversion.',
      },
    ],
    relatedToolIds: ['base64-decoder', 'binary-to-decimal-converter'],
    seoTitle: 'Base64 Encoder Online – UTF-8 Safe | Zenvi Tools',
    seoDescription: 'Encode text to Base64 format locally in your browser.',
  },
  {
    id: 'base64-decoder',
    name: 'Base64 Decoder',
    category: 'qr-other',
    shortDescription: 'Decode Base64 strings back into readable plain text.',
    fullDescription:
      'Decode Base64-encoded strings back into UTF-8 text with clear validation if the input is malformed.',
    instructions: [
      'Paste a valid Base64 string.',
      'View and copy the decoded text.',
    ],
    examples: [{ input: 'WmVudmkgVG9vbHM=', output: 'Zenvi Tools' }],
    faqs: [
      {
        question: 'What happens if I paste invalid Base64?',
        answer: 'The tool will display a clear error message explaining that the Base64 string is malformed.',
      },
    ],
    relatedToolIds: ['base64-encoder', 'text-cleaner'],
    seoTitle: 'Base64 Decoder Online – Decode Base64 to Text | Zenvi Tools',
    seoDescription: 'Decode Base64 strings to plain text directly in your browser.',
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    category: 'qr-other',
    shortDescription: 'Pick colors visually and copy HEX, RGB, and HSL values.',
    fullDescription:
      'Interactive color picker with live swatch preview, lightness/saturation adjustments, and one-click copy for HEX, RGB, and HSL.',
    instructions: [
      'Use the visual color picker or enter a HEX code.',
      'Copy the HEX, RGB, or HSL color code.',
    ],
    faqs: [
      {
        question: 'Which color formats can I copy?',
        answer: 'HEX (#7045C6), RGB (rgb(112, 69, 198)), and HSL (hsl(260, 53%, 52%)).',
      },
    ],
    relatedToolIds: ['color-code-converter', 'qr-code-generator'],
    seoTitle: 'Color Picker Online – HEX, RGB & HSL | Zenvi Tools',
    seoDescription: 'Pick colors visually and copy HEX, RGB, and HSL codes.',
  },
  {
    id: 'color-code-converter',
    name: 'Color Code Converter',
    category: 'qr-other',
    shortDescription: 'Convert between HEX, RGB, HSL, and CMYK color codes.',
    fullDescription:
      'Translate any HEX, RGB, or HSL color value into all other web and print color formats with a live color preview.',
    instructions: [
      'Enter a color in HEX (e.g., #7045C6), RGB, or HSL.',
      'View and copy the converted HEX, RGB, HSL, and CMYK values.',
    ],
    examples: [{ input: '#7045C6', output: 'rgb(112, 69, 198) · hsl(260, 53%, 52%)' }],
    faqs: [
      {
        question: 'Does it support 3-digit shorthand HEX codes?',
        answer: 'Yes, both #RGB and #RRGGBB formats are supported.',
      },
    ],
    relatedToolIds: ['color-picker', 'qr-code-generator'],
    seoTitle: 'Color Code Converter – HEX, RGB, HSL & CMYK | Zenvi Tools',
    seoDescription: 'Convert color codes between HEX, RGB, HSL, and CMYK.',
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    category: 'qr-other',
    shortDescription: 'Generate random integers within any range, with optional unique mode.',
    fullDescription:
      'Generate single or multiple random numbers between a minimum and maximum value using secure browser randomness.',
    instructions: [
      'Set Minimum and Maximum values.',
      'Choose how many numbers to generate and whether to allow duplicates.',
      'Click Generate.',
    ],
    faqs: [
      {
        question: 'Can I generate unique lottery-style numbers without repeats?',
        answer: 'Yes, uncheck "Allow Duplicates" to generate unique numbers within your range.',
      },
    ],
    relatedToolIds: ['password-generator', 'average-calculator'],
    seoTitle: 'Random Number Generator Online – Custom Range | Zenvi Tools',
    seoDescription: 'Generate random numbers within any min/max range online.',
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.id === id);
}

export function getToolsByCategory(category: ToolCategoryId): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.category === category);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryById(id: ToolCategoryId): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS_REGISTRY;
  return TOOLS_REGISTRY.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.fullDescription.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}
