import React from "react";
import { LeadStatus } from "@/lib/admin/types";

interface StatusBadgeProps {
  status: LeadStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  let badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";

  switch (status.toUpperCase()) {
    case "NEW":
      badgeStyle = "bg-teal-50 text-teal-800 border-teal-200";
      break;
    case "CONTACTED":
      badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
      break;
    case "QUALIFIED":
      badgeStyle = "bg-emerald-100/70 text-emerald-900 border-emerald-300";
      break;
    case "REQUIREMENT DISCUSSED":
      badgeStyle = "bg-teal-100/70 text-teal-900 border-teal-300";
      break;
    case "QUOTATION SENT":
      badgeStyle = "bg-emerald-100 text-emerald-900 border-emerald-400/80";
      break;
    case "FOLLOW-UP":
      badgeStyle = "bg-amber-50 text-amber-900 border-amber-200";
      break;
    case "NEGOTIATION":
      badgeStyle = "bg-teal-100 text-teal-950 border-teal-400";
      break;
    case "WON":
    case "COMPLETED":
    case "CONFIRMED":
    case "SELECTED":
      badgeStyle = "bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs";
      break;
    case "LOST":
    case "CANCELLED":
    case "REJECTED":
    case "OVERDUE":
      badgeStyle = "bg-rose-50 text-rose-800 border-rose-200";
      break;
    case "PENDING":
    case "UNDER REVIEW":
      badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
      break;
    case "SHORTLISTED":
    case "INTERVIEW":
      badgeStyle = "bg-teal-50 text-teal-800 border-teal-200";
      break;
    default:
      badgeStyle = "bg-zinc-100 text-zinc-800 border-zinc-200";
  }

  const px = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${badgeStyle} ${px} tracking-wide whitespace-nowrap`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status.toUpperCase() === "WON" ||
          status.toUpperCase() === "CONFIRMED" ||
          status.toUpperCase() === "COMPLETED"
            ? "bg-white"
            : "bg-current"
        }`}
      />
      {status}
    </span>
  );
}
