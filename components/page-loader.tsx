// components/PageLoader.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css'; // You can customize the CSS for color/height

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When the URL changes (pathname or params), stop the loader
    nProgress.done();
  }, [pathname, searchParams]);

  // We wrap links or use a global click listener to start the loader
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      // Only trigger if it's an internal link and not opening in a new tab
      if (anchor && anchor.href && anchor.host === window.location.host && !anchor.target) {
        nProgress.start();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}