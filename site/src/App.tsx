import { useEffect, useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { initSmoothScroll, getLenis, ScrollTrigger, scrollToTop } from "./lib/motion";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";

function useRouteEffects() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    scrollToTop(true);
  }, [pathname, hash]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (hash) {
        const el = document.querySelector(hash);
        const l = getLenis();
        if (el && l) l.scrollTo(el as HTMLElement, { offset: -90, duration: 1.4 });
        else el?.scrollIntoView();
      }
    }, 80);
    return () => window.clearTimeout(id);
  }, [pathname, hash]);
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    initSmoothScroll();
  }, []);
  useRouteEffects();

  return (
    <>
      <Nav />
      <main key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
