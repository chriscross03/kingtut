import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to KingTut Study Hub</h1>

      {/* Image from public folder */}
      <Image
        src="/sat-logo.png" // <-- just the path relative to /public
        alt="SAT Logo"
        width={200}
        height={100}
      />

      <p>Choose a subject to get started:</p>

      <Link
        href="/sat"
        style={{
          textDecoration: "none",
          color: "#1a73e8",
          fontSize: "1.2rem",
        }}
      >
        Go to SAT Practice →
      </Link>
    </div>
  );
}
