'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, Globe, Shield, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const VALUES = [
  {
    title: 'Inclusivity',
    desc: 'We believe every community deserves a voice and a space to gather.',
    icon: Users,
    gradient: '#6D28D9',
    glow: 'rgba(109,40,217,0.25)',
  },
  {
    title: 'Accessibility',
    desc: 'Our platform is designed to be usable by everyone, everywhere.',
    icon: Globe,
    gradient: '#4F46E5',
    glow: 'rgba(79,70,229,0.25)',
  },
  {
    title: 'Safety',
    desc: 'We prioritize the security and privacy of our users and data.',
    icon: Shield,
    gradient: '#2563EB',
    glow: 'rgba(37,99,235,0.25)',
  },
  {
    title: 'Innovation',
    desc: 'Pushing the boundaries of how events are discovered and managed.',
    icon: Zap,
    gradient: '#059669',
    glow: 'rgba(5,150,105,0.25)',
  },
];

function ValueCard({
  item,
  index,
  visible,
}: {
  item: (typeof VALUES)[number];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon: LucideIcon = item.icon;

  return (
    <div
      className="value-card-wrapper"
      style={{ animationDelay: `${index * 150}ms` }}
      data-visible={visible}
    >
      <div
        className="value-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          boxShadow: hovered
            ? `0 20px 60px ${item.glow}, 0 0 0 1px ${item.glow}`
            : '0 2px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Gradient icon circle */}
        <div
          className="value-icon-ring"
          style={{
            background: hovered ? item.gradient : 'rgba(124,58,237,0.08)',
            transform: hovered ? 'scale(1.12) rotate(-8deg)' : 'scale(1) rotate(0deg)',
          }}
        >
          <Icon
            className="value-icon"
            style={{ color: hovered ? '#fff' : 'var(--primary)' }}
          />
        </div>

        <h3 className="value-title">{item.title}</h3>
        <p className="value-desc">{item.desc}</p>

        {/* Gradient bottom accent */}
        <div
          className="value-accent"
          style={{
            background: item.gradient,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />
      </div>
    </div>
  );
}

export default function ValuesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .values-section {
          text-align: center;
        }

        .values-heading {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }

        .values-subtext {
          color: var(--muted-foreground);
          font-size: 1rem;
          margin-bottom: 3.5rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }
        @media (max-width: 640px) {
          .values-grid { grid-template-columns: 1fr; }
        }

        /* ── Card wrapper: fade-up animation ── */
        .value-card-wrapper {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .value-card-wrapper[data-visible='true'] {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── The card itself ── */
        .value-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          padding: 2.25rem 1.75rem 2.5rem;
          border-radius: 1.5rem;
          background: var(--card);
          border: 1px solid var(--border);
          cursor: default;
          transition: box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
        }
        .value-card:hover {
          transform: translateY(-6px);
          border-color: transparent;
        }

        .value-icon-ring {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 4rem;
          width: 4rem;
          border-radius: 1.25rem;
          flex-shrink: 0;
          transition: background 0.35s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
        }

        .value-icon {
          height: 1.75rem;
          width: 1.75rem;
          transition: color 0.3s ease;
        }

        .value-title {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--foreground);
        }

        .value-desc {
          font-size: 0.9rem;
          color: var(--muted-foreground);
          line-height: 1.65;
        }

        /* Gradient bottom bar */
        .value-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          border-radius: 0 0 1.5rem 1.5rem;
          transform-origin: left center;
          transition: opacity 0.3s ease, transform 0.45s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>

      <div ref={ref} className="values-section">
        <h2 className="values-heading text-foreground">Why Eventify?</h2>
        <p className="values-subtext">The values that drive our platform every day.</p>

        <div className="values-grid">
          {VALUES.map((item, i) => (
            <ValueCard key={item.title} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </>
  );
}
