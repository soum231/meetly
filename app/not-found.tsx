import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 px-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <h2 className="text-xl text-white/60 mb-2">Meeting Not Found</h2>
      <p className="text-white/40 text-sm mb-6">
        The meeting you are looking for does not exist or has ended.
      </p>
      <Link href="/">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
