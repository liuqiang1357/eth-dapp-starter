import Link from 'next/link';

export default function Page() {
  return (
    <div className="container">
      <h1>Home</h1>
      <div className="mt-3 flex flex-col space-y-2">
        <Link className="text-primary" href="/examples/transfer">
          Example: transfer
        </Link>
      </div>
    </div>
  );
}
