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
    percent: 29,
    completed: ["Rules Addition", "Rules Implementation"],
    inProgress: ["PCAP File Analysis", "Network Topology Simulation", "Post Attack Analysis"],
    planned: [
      "Rules Addition",
      "Rules Implementation",
      "PCAP File Analysis",
      "Network Topology Simulation",
      "Post Attack Analysis"
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
