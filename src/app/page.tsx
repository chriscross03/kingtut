import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to My Site</h1>
      <p>Check out our Algebra lessons:</p>
      <Link href="/algebra" className="text-blue-600 hover:underline text-lg">
        Go to Algebra Lessons →
      </Link>
    </div>
  );
}
