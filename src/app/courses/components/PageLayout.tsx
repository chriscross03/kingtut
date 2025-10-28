export default function PageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{title}</h1>
      {subtitle && (
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
