import type { ReactNode } from "react";
import { SplitText, Reveal } from "./Reveal";
import "./PageHero.css";

type Props = {
  eyebrow: string;
  title: string;
  highlight?: string[];
  lead: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, highlight, lead, children, aside }: Props) {
  return (
    <section className="page-hero">
      <div className="ph-bg" aria-hidden />
      <div className={`wrap ph-inner ${aside ? "has-aside" : ""}`}>
        <div className="ph-main">
        <Reveal as="span" className="eyebrow" y={10}>
          {eyebrow}
        </Reveal>
        <SplitText as="h1" className="h1 ph-title" text={title} highlight={highlight} immediate delay={0.1} />
        <Reveal as="p" className="lead ph-lead" delay={0.35}>
          {lead}
        </Reveal>
        {children}
        </div>
        {aside ? (
          <Reveal className="ph-aside" delay={0.3} y={30}>
            {aside}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
