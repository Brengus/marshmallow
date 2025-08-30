// assets/src/scrollAnimations.js

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function setupScrollAnimations(model) {
  if (!model) return;

  // --- MODERN .matchMedia() SYNTAX ---
  // 1. Create a MatchMedia instance
  const mm = gsap.matchMedia();

  // 2. Use the .add() method to define animations for different breakpoints
  mm.add({
    // Define custom properties for your breakpoints for easy reference
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)",
    // You can even define a "prefers reduced motion" condition
    reduceMotion: "(prefers-reduced-motion: reduce)"

  }, (context) => {
    // 3. The context object contains the matched conditions
    // We can destructure it to get our boolean flags
    const { isDesktop, isMobile, reduceMotion } = context.conditions;

    // --- DESKTOP ANIMATIONS ---
    if (isDesktop) {
        // Section 1: Move right
        gsap.to(model.position, {
            x: 3,
            y: 0,
            scrollTrigger: {
                trigger: ".section-1",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.rotation, {
            y: Math.PI * 4,
            scrollTrigger: {
                trigger: ".section-2",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.position, {
            x: -3,
            y: 1,
            scrollTrigger: {
                trigger: ".section-4",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.position, {
            x: 3,
            scrollTrigger: {
                trigger: ".section-5",
                start: "top center",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.rotation, {
            y: Math.PI * 4,
            scrollTrigger: {
                trigger: ".section-5",
                start: "top center",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.rotation, {
            z: Math.PI * 4,
            y: Math.PI * 4,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".section-6",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.position, {
            x: -3,
            y: 0,
            scrollTrigger: {
                trigger: ".section-6",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });

        // Section 5: Glide from left to right while rotating
        const tl5 = gsap.timeline({
            scrollTrigger: {
                trigger: ".section-5",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        tl5.to(model.position, { x: 3 })
           .to(model.rotation, { y: Math.PI * 4 }, 0);

        // Section 6: Barrel roll and move back
        const tl6 = gsap.timeline({
            scrollTrigger: {
                trigger: ".section-6",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        tl6.to(model.position, { x: 0, y: 0 })
           .to(model.rotation, { z: Math.PI * 2, y: Math.PI * 2, ease: "power1.inOut" }, 0);
    }

    // --- MOBILE ANIMATIONS ---
    if (isMobile) {
        gsap.set(model.position, { x: 0 });

        gsap.to(model.rotation, {
            y: Math.PI * 4,
            scrollTrigger: {
                trigger: ".section-2",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.rotation, {
            y: Math.PI * 4,
            scrollTrigger: {
                trigger: ".section-5",
                start: "top center",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.rotation, {
            z: Math.PI * 4,
            y: Math.PI * 4,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".section-6",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
    }

    return () => { 
      console.log("matchMedia context cleaned up!");
    }
  });
}