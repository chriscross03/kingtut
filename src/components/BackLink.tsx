"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href?: string;
  label?: string;
}

export default function BackLink({ href, label = "Back" }: BackLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (href) router.push(href);
    else router.back();
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        color: "#1a73e8",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        marginBottom: "1rem",
      }}
    >
      <ArrowLeft size={18} style={{ marginRight: "0.5rem" }} />
      {label}
    </button>
  );
}
