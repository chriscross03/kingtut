import Link from "next/link";
import { useState } from "react";

interface ResourceItemProps {
  id: string | number;
  name: string;
  slug?: string | null;
  description?: string | null;
  basePath: string;
}

export default function ResourceItem({
  id,
  name,
  slug,
  description,
  basePath,
}: ResourceItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <li style={{ marginBottom: "1.2rem" }}>
      <Link
        href={`${basePath}/${slug || id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          textDecoration: "none",
          color: "#1a73e8",
          fontSize: "1.15rem",
          fontWeight: "500",
          display: "block",
          padding: "1rem",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          transition: "background-color 0.2s, color 0.2s",
          backgroundColor: hovered ? "#f9fafb" : "transparent",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>{name}</h3>
        {description && (
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            {description}
          </p>
        )}
      </Link>
    </li>
  );
}
