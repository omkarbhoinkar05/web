"use client";

import React from "react";
import { LeadSource } from "@/lib/admin/types";

interface DonutSegment {
  source: LeadSource | string;
  count: number;
  percentage: number;
}

interface SourceDonutChartProps {
  data: DonutSegment[];
  totalLeads: number;
}

const GREEN_TEAL_COLORS = [
  "#10B981", // Emerald 500
  "#0D9488", // Teal 600
  "#059669", // Emerald 600
  "#047857", // Emerald 700
  "#14B8A6", // Teal 500
  "#34D399", // Emerald 400
  "#2DD4BF", // Teal 400
  "#065F46", // Emerald 800
];

export function SourceDonutChart({ data, totalLeads }: SourceDonutChartProps) {
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const validData = data && data.length > 0 ? data : [{ source: "No Data", count: 1, percentage: 100 }];
  const actualTotal = totalLeads > 0 ? totalLeads : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* SVG Donut */}
      <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {validData.map((item, idx) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.percentage;
            const color = GREEN_TEAL_COLORS[idx % GREEN_TEAL_COLORS.length];

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 hover:opacity-85"
              />
            );
          })}
        </svg>

        {/* Center Total Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{actualTotal.toLocaleString()}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-2">
        {validData.slice(0, 6).map((item, idx) => {
          const color = GREEN_TEAL_COLORS[idx % GREEN_TEAL_COLORS.length];
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="font-medium text-slate-700 truncate max-w-[120px]">{item.source}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-slate-900">{item.count}</span>
                <span className="text-slate-400 text-[11px]">({item.percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ServiceBarChartProps {
  services: { service: string; count: number }[];
}

export function ServiceBarChart({ services }: ServiceBarChartProps) {
  const maxCount = Math.max(...services.map((s) => s.count), 1);

  if (!services || services.length === 0) {
    return <div className="text-xs text-slate-400 py-6 text-center">No service records available yet.</div>;
  }

  return (
    <div className="space-y-3.5">
      {services.slice(0, 7).map((item, idx) => {
        const percent = Math.round((item.count / maxCount) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-800 truncate max-w-[200px]">{item.service}</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 text-[11px]">
                {item.count} req
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${Math.max(percent, 8)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
