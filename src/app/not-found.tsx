import Link from 'next/link';
import { Button } from '@/ui/shadcn/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">Page not found.</div>
      <Button asChild>
        <Link className="mt-4" href="/">
          Back to home
        </Link>
      </Button>
    </div>
  );
}
