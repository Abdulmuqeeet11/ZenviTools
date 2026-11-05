'use client';

import { handleLinkClick } from '../utils/navigation';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="bg-white border border-[#E4D9FA] rounded-2xl p-8 sm:p-10 shadow-xs">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7045C6]">
          404 — Page Not Found
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#38205F]">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#4A3B69]">
          The link may be mistyped or moved. Browse all 87 free tools or return to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#7045C6] text-white hover:bg-[#5B34AB]"
          >
            Go to Homepage
          </a>
          <a
            href="/all-tools"
            onClick={(e) => handleLinkClick(e, '/all-tools')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#F7F3FF] text-[#38205F] border border-[#D6C6F7] hover:bg-[#EDE4FF]"
          >
            Browse All 87 Tools
          </a>
        </div>
      </div>
    </div>
  );
}
