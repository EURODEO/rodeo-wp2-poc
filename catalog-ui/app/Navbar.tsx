import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="h-10 flex items-center justify-between">
      <Link href="/" className="hover:opacity-80 transition ease-in-out">
        Discovery Metadata catalog
      </Link>
      <Link
        href="/search"
        className="self-center hover:opacity-80 transition ease-in-out"
      >
        Search
      </Link>
    </nav>
  );
};
