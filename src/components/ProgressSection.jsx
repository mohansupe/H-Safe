// src/components/ProgressSection.jsx
import React, { useEffect, useState } from "react";

const defaultData = {
  percent: 29,
  completed: [
    "Rules Addition",
    "Rules Implementation"
  ],
  inProgress: [
    "PCAP File Analysis",
    "Network Topology Simulation",
    "Post Attack Analysis"
  ],
  planned: [
    "Rules Addition",
    "Rules Implementation",
    "PCAP File Analysis",
    "Network Topology Simulation",
    "Post Attack Analysis"
  ]
};

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5.293 11.879a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M4 4v5h5" />
      <path d="M16 16v-5h-5" />
      <path d="M5 8a7 7 0 1010 6.93" />
    </svg>
  );
}

function DotIcon() {
  return <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>;
}

export default function ProgressSection({ data = defaultData }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // animate up to target percent
    const target = Number(data.percent || 0);
    let start = 0;
    const step = () => {
      start += Math.max(1, Math.round(target / 30));
      if (start >= target) {
        start = target;
        setPercent(start);
      } else {
        setPercent(start);
        requestAnimationFrame(step);
      }
    };
    const t = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(t);
  }, [data.percent]);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          grid-auto-rows: auto;
        }

        .bento-item {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%);
          border: 1px solid rgba(100, 116, 139, 0.2);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .bento-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .bento-item:hover::before {
          opacity: 1;
        }

        .bento-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%);
        }

        .progress-container {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .bento-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bento-title::before {
          content: '';
          width: 4px;
          height: 24px;
          background: linear-gradient(180deg, #3b82f6, #60a5fa);
          border-radius: 2px;
        }

        .item-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
          color: #cbd5e1;
        }

        .item-list li:hover {
          background: rgba(59, 130, 246, 0.1);
          padding-left: 14px;
          color: #e2e8f0;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 600;
          color: #cbd5e1;
        }

        .progress-bar-container {
          position: relative;
          height: 8px;
          background: linear-gradient(90deg, rgba(100, 116, 139, 0.3), rgba(100, 116, 139, 0.2));
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 10px;
          transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
        }

        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .progress-container {
            grid-column: 1 / -1;
          }
        }
      `}</style>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-2">
            Project Progress
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Track our development journey as we build the next generation of firewall technology
          </p>
        </div>

        <div className="bento-grid">
          {/* Progress Bar - Full Width */}
          <div className="bento-item progress-container">
            <div className="progress-label">
              <span>Overall Progress</span>
              <span className="text-blue-400 font-bold text-lg">{percent}%</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Completed */}
          <div className="bento-item">
            <h3 className="bento-title">Completed</h3>
            <ul className="item-list">
              {data.completed.map((item, idx) => (
                <li key={idx} className="group">
                  <div className="flex-shrink-0 mt-1"><CheckIcon /></div>
                  <div className="group-hover:text-blue-300 transition-colors">{item}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* In Progress */}
          <div className="bento-item">
            <h3 className="bento-title">In Progress</h3>
            <ul className="item-list">
              {data.inProgress.map((item, idx) => (
                <li key={idx} className="group">
                  <div className="flex-shrink-0 mt-1"><SyncIcon /></div>
                  <div className="group-hover:text-blue-300 transition-colors">{item}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Planned */}
          <div className="bento-item">
            <h3 className="bento-title">Planned</h3>
            <ul className="item-list">
              {data.planned.map((item, idx) => (
                <li key={idx} className="group">
                  <div className="flex-shrink-0 mt-1"><DotIcon /></div>
                  <div className="group-hover:text-blue-300 transition-colors">{item}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
