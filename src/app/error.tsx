'use client';

import Link from 'next/link';
import { Button } from '@/ui/shadcn/button';

export default function Error() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">Something went wrong!</div>
      <Button asChild>
        <Link className="mt-4" href="/">
          Back to home
        </Link>
      </Button>
    </div>
  );
}
