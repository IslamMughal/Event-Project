'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { label: 'Events Hosted',  value: 10000, suffix: 'K+', display: '10K+',  icon: '🎉' },
  { label: 'Active Users',   value: 50000, suffix: 'K+', display: '50K+',  icon: '👥' },
  { label: 'Cities Covered', value: 200,   suffix: '+',  display: '200+',  icon: '🌍' },
  { label: 'Organizers',     value: 5000,  suffix: 'K+', display: '5K+',   icon: '🏆' },
];

function useCountUp(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const end = target;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
}

function StatCard({
  stat,
  started,
  index,
}: {
  stat: (typeof STATS)[number];
  started: boolean;
  index: number;
}) {
  const count = useCountUp(
    stat.suffix === 'K+' ? stat.value / 1000 : stat.value,
    1800,
    started,
  );

  const display = started
    ? stat.suffix === 'K+'
      ? `${count}K+`
      : `${count}+`
    : '0';

  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <span className="stat-icon">{stat.icon}</span>
      <p className="stat-value">{display}</p>
      <p className="stat-label">{stat.label}</p>

      {/* Animated bottom border */}
      <div className="stat-bar" />
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          text-align: center;
          padding: 2.5rem 1.5rem;
          border-radius: 1.5rem;
          background: var(--card);
          border: 1px solid var(--border);
          box-shadow: 0 1px 4px rgba(0,0,0,.06);
          cursor: default;
          opacity: 0;
          transform: translateY(24px);
          animation: statFadeUp 0.6s ease forwards;
          transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
        }
        .stat-card:hover {
          box-shadow: 0 12px 40px rgba(108,59,255,.12);
          transform: translateY(-4px);
          border-color: var(--primary);
        }
        .stat-card:hover .stat-bar {
          width: 100%;
        }
        .stat-card:hover .stat-icon {
          transform: scale(1.25) rotate(-6deg);
        }

        @keyframes statFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-icon {
          display: inline-block;
          font-size: 2rem;
          margin-bottom: 0.75rem;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }

        .stat-value {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          color: var(--primary);
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 0.5rem;
          font-variant-numeric: tabular-nums;
        }

        .stat-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--muted-foreground);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .stat-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 0;
          background: linear-gradient(90deg, #6C3BFF, #EC4899);
          border-radius: 0 0 1.5rem 1.5rem;
          transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div ref={ref} className="stats-grid">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} started={started} index={i} />
        ))}
      </div>
    </>
  );
}
