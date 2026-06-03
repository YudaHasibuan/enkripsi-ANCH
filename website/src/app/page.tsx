"use client";

import { useState, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import PipelineSection from "@/components/PipelineSection";
import FeaturesSection from "@/components/FeaturesSection";
import PlaygroundSection from "@/components/PlaygroundSection";
import BenchmarkSection from "@/components/BenchmarkSection";
import InstallSection from "@/components/InstallSection";
import RoadmapSection from "@/components/RoadmapSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="anch-bg min-h-screen">
      <Nav />
      <HeroSection />
      <PipelineSection />
      <FeaturesSection />
      <PlaygroundSection />
      <BenchmarkSection />
      <InstallSection />
      <RoadmapSection />
      <Footer />
    </main>
  );
}
