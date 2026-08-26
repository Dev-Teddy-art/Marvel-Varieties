'use client';

import dynamic from 'next/dynamic';

export const Product3DViewer = dynamic(
  () => import('./ProductCanvas').then((mod) => mod.ProductCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse text-sm text-gray-500 font-medium">
        Loading 3D Visualizer...
      </div>
    ),
  }
);