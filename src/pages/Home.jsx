import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Modules from "../components/Modules";
import ProgressSection from "../components/ProgressSection";
import FeedbackForm from "../components/FeedbackForm";

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
    <div>
      <Hero />
      <ProgressSection data={progressData} />
      <Modules />
      <Features />
      <FeedbackForm />
    </div>
  );
}
