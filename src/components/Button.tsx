import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#10b981] disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 rounded-full gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-full gap-2",
    lg: "text-base px-6 py-3.5 rounded-full gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:from-[#059669] hover:via-[#047857] hover:to-[#065f46] text-white shadow-lg shadow-[#10b981]/25 hover:shadow-[#10b981]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    secondary:
      "bg-zinc-900 hover:bg-zinc-800 text-white shadow-md shadow-zinc-900/15 hover:-translate-y-0.5 active:translate-y-0",
    outline:
      "bg-white/80 hover:bg-zinc-50/90 text-zinc-800 border border-zinc-200/90 shadow-sm hover:border-zinc-300 hover:shadow hover:-translate-y-0.5 active:translate-y-0",
    ghost:
      "bg-transparent hover:bg-zinc-100/80 text-zinc-700 hover:text-zinc-950",
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
        {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
      </a>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
    </button>
  );
}
