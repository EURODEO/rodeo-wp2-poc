import Link from "next/link";

export const Navbar = () => {
  return (
    <nav>
      <Link href="/">Discovery Metadata catalog</Link>
      <Link href="/search">Search</Link>
    </nav>
  );
};
