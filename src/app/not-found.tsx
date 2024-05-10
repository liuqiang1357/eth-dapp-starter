import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl">Page not found.</div>
      <Link className="mt-4" href="/">
        Back to home
      </Link>
    </div>
  );
}
