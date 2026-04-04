export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-card
        text-foreground
        rounded-2xl
        shadow-md
        hover:shadow-lg hover:-translate-y-1
        border border-default
        p-6
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}