import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function setupScrollAnimations(model) {
  if (!model) return;

  ScrollTrigger.matchMedia({

    "(min-width: 768px)": function() {
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
            y: Math.PI * 2,
            scrollTrigger: {
                trigger: ".section-2",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        // gsap.to(model.scale, {
        //     x: 1.5, y: 1.5, z: 1.5,
        //     scrollTrigger: {
        //         trigger: ".section-3",
        //         start: "top bottom",
        //         end: "bottom top",
        //         scrub: 1,
        //     }
        // });
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
        gsap.to(model.scale, {
            x: 1, y: 1, z: 1, 
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
    },



    "(max-width: 767px)": function() {
      gsap.set(model.position, { x: 0 });

      gsap.to(model.rotation, {
            y: Math.PI * 2,
            scrollTrigger: {
                trigger: ".section-2",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.scale, {
            x: 1.5, y: 1.5, z: 1.5,
            scrollTrigger: {
                trigger: ".section-3",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });
        gsap.to(model.scale, {
            x: 1, y: 1, z: 1, 
            scrollTrigger: {
                trigger: ".section-4",
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

  });
}