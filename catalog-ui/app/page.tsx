import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-full bg-gradient-radial from-cyan-300 dark:from-cyan-800 via=35% via-zinc-200 dark:via-zinc-900 to-zinc-100 dark:to-black bg-min-plus animate-slow-spin shadow-inner-light dark:shadow-inner-dark">
      <div className="w-full h-full grow flex flex-col justify-evenly items-center backdrop-blur">
        <h1 className="text-8xl w-96 self-start ml-10 lg:ml-30 xl:ml-60">
          Discovery Metadata catalog
        </h1>
        <Link
          href="/search"
          className="border-4 border-black dark:border-white p-2 px-5 rounded-xl bg-cyan-500 bg-opacity-0 hover:bg-opacity-30 transition ease-in-out"
        >
          Browse
        </Link>
      </div>
    </main>
  );
}
