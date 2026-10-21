import { Hero } from "../components/home/Hero";
import { Ticker } from "../components/home/Ticker";
import { Manifesto } from "../components/home/Manifesto";
import { ServicesBento } from "../components/home/ServicesBento";
import { AgentsStory } from "../components/home/AgentsStory";
import { WorkCarousel } from "../components/home/WorkCarousel";
import { Process } from "../components/home/Process";
import { CtaBand } from "../components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Manifesto />
      <ServicesBento />
      <AgentsStory />
      <WorkCarousel />
      <Process />
      <CtaBand />
    </>
  );
}
