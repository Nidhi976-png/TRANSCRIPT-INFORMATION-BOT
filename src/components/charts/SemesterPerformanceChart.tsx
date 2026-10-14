import React, { useState } from 'react';
import { SemesterSummary } from '../../types/transcript';

interface Props {
  summaries: SemesterSummary[];
  currentSgpa: number | null;
  cgpa: number | null;
}

export const SemesterPerformanceChart: React.FC<Props> = ({ summaries, currentSgpa, cgpa }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!summaries || summaries.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        No semester data available for trajectory chart. Upload transcripts to view trend.
      </div>
    );
  }

  // Chart dimensions
  const width = 600;
  const height = 220;
  const padding = { top: 25, right: 30, bottom: 35, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minVal = 6.0;
  const maxVal = 10.0;

  const points = summaries.map((s, idx) => {
    const sgpaVal = s.sgpa ?? 0;
    const x = summaries.length === 1
      ? padding.left + chartWidth / 2
      : padding.left + (idx / (summaries.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((sgpaVal - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, sgpa: sgpaVal, sem: s.semester, credits: s.earnedCredits };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : '';

  // CGPA reference line Y
  const cgpaY = cgpa ? padding.top + chartHeight - ((cgpa - minVal) / (maxVal - minVal)) * chartHeight : null;

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Semester-wise SGPA Progression</h3>
          <p className="text-xs text-slate-500">Academic performance curve across registered semesters</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-purple-600 inline-block"></span>
            <span className="font-medium text-slate-600">Semester SGPA</span>
          </div>
          {cgpa && (
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-navy-600 border-t-2 border-dashed border-blue-600 inline-block"></span>
              <span className="font-medium text-slate-600">Overall CGPA ({cgpa.toFixed(2)})</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 select-none">
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[6.0, 7.0, 8.0, 9.0, 10.0].map((val) => {
            const y = padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="sans-serif"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* CGPA Benchmark Dashed Line */}
          {cgpaY !== null && (
            <line
              x1={padding.left}
              y1={cgpaY}
              x2={width - padding.right}
              y2={cgpaY}
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Area fill */}
          {points.length > 1 && (
            <path d={areaD} fill="url(#purpleGradient)" />
          )}

          {/* Line stroke */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points & Labels */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 6 : 4.5}
                fill="#ffffff"
                stroke="#7c3aed"
                strokeWidth={hoveredIdx === idx ? 3 : 2.5}
                className="transition-all duration-150"
              />
              <text
                x={p.x}
                y={padding.top + chartHeight + 18}
                textAnchor="middle"
                fontSize="11"
                fill={hoveredIdx === idx ? '#4c1d95' : '#64748b'}
                fontWeight={hoveredIdx === idx ? '600' : '500'}
              >
                Sem {p.sem}
              </text>
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#6d28d9"
              >
                {p.sgpa.toFixed(2)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {hoveredIdx !== null && summaries[hoveredIdx] && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 border border-slate-200">
          <span className="font-semibold text-purple-900">
            Semester {summaries[hoveredIdx].semester} Breakdown
          </span>
          <span className="text-slate-600">
            SGPA: <strong className="text-purple-700">{summaries[hoveredIdx].sgpa?.toFixed(2)}</strong> | Credits:{' '}
            <strong>{summaries[hoveredIdx].earnedCredits}</strong> | Passed:{' '}
            <strong className="text-emerald-700">{summaries[hoveredIdx].passedCount}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
