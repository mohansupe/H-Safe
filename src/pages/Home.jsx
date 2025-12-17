import React from "react";
import Hero from "../components/Hero";
import WhyHSafe from "../components/WhyHSafe";
import TargetAudience from "../components/TargetAudience";
import Modules from "../components/Modules";
import ProgressSection from "../components/ProgressSection";
import RevealOnScroll from "../components/RevealOnScroll";

export default function Home() {
  // optionally pass data prop to change percent and lists
  const progressData = {
    percent: 75,
    completed: [
      "Stateful Rule Engine",
      "Interactive Topology Builder",
      "Drag-and-Drop Rule Manager",
      "Secure Access Control",
      "PCAP Analysis Module"
    ],
    inProgress: [
      "Real-time Packet Visualization",
      "Automated Threat Reporting",
      "Advanced Traffic Forensics"
    ],
    planned: [
      "AI-Driven Anomaly Detection",
      "Cloud Environment Integration",
      "Multi-User Team Collaboration"
    ]
  };

  return (
    <div className="overflow-hidden">
      <Hero />
      <WhyHSafe />
      <Modules />
      <TargetAudience />
      <ProgressSection data={progressData} />
    </div>
  );
}
