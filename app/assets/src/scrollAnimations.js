import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";


export function setupScrollAnimations(model) {
  if (!model) return;
    
  gsap.to(model.position, {
    x: 3,
    y: 2,
    scrollTrigger: {
      trigger: ".section-1",
      start: "top bottom", 
      end: "bottom top", 
      scrub: 1, 
    }
  });

  gsap.to(model.rotation, {
    y: Math.PI * 2, 
    scrollTrigger: {
      trigger: ".section-2",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    }
  });

  gsap.to(model.position, {
    scrollTrigger: {
      trigger: ".section-3",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    }
  });
  gsap.to(model.position, {
    x: -1.5,
    y: 10.5,
    scrollTrigger: {
      trigger: ".section-4",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    }
  });
  gsap.to(model.scale, {
    x: 1,
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
  gsap.to(model.scale, {
    x: 0.5,
    y: 0.5,
    scrollTrigger: {
    trigger: ".section-6",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    }
  });
}