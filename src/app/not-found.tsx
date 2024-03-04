import { Button } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">Page not found.</div>
      <Button className="mt-4" component={Link} size="md" href="/">
        Back to home
      </Button>
    </div>
  );
}
