import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function setupScrollAnimations(model) {
    if (!model) return;

    let span1 = new SplitText(".span1", { type: "words" });
    let span2 = new SplitText(".span2", { type: "words", wordsClass: "word" });
    let span3 = new SplitText(".span3", { type: "lines", linesClass: "line-parent" });
    let span4 = new SplitText(".span4", { type: "words" });
    let span5 = new SplitText(".span5", { type: "words" });
    let span6 = new SplitText(".span6", { type: "words" });

    const mm = gsap.matchMedia();
    mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"

    }, (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions;
        if (isDesktop) {
            gsap.from(span1.words, {
                y: 60,
                opacity: 0,
                rotationX: -90, // Flips the words in from the bottom
                stagger: {
                each: 0.05,
                from: "start" // Creates the wave effect from left to right
                }
            });

            gsap.from(span2.words, {
                scrollTrigger:{
                trigger: ".section-2",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                scale: 0, // Start scaled to nothing
                autoAlpha: 0,
                ease: "back.out(1.7)", // This ease creates the bouncy "pop"
                stagger: {
                amount: 0.05,
                from: "random",
                }
            });
            gsap.from(span3.lines, {
                scrollTrigger:{
                trigger: ".section-3",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                x: -200, // Slide the entire line in from the left
                autoAlpha: 0,
                stagger: {
                amount: 0.1
                }
            });
            gsap.from(span4.words, {
                scrollTrigger:{
                trigger: ".section-4",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                y: 80,
                rotationZ: 180, // Each word does a 180-degree spin
                autoAlpha: 0,
                stagger: {
                amount: 0.1,
                from: "center" // Animation radiates from the center word
                }
            });
            gsap.from(span5.words, {
                scrollTrigger:{
                trigger: ".section-5",
                start: "top 60%",
                end: "center 60%",
                scrub: 2, // A longer scrub makes it feel slower and floatier
                },
                y: 150, // Start far below
                autoAlpha: 0,
                ease: "power2.out", // A smooth, decelerating ease
                stagger: {
                amount: 0.1,
                from: "random"
                }
            });
            gsap.from(span6.words, {
                scrollTrigger:{
                trigger: ".section-6",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                y: 50,
                autoAlpha: 0,
                color: "#ff9a9e", // Start with a warm "toasted" color
                stagger: {
                amount: 0.1,
                from: "end" // A wave from right to left for a finishing feel
                }
            });
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
        if (isMobile) {
            gsap.set(model.position, { x: 0 });
            gsap.from(span1.words, {
                y: 60,
                opacity: 0,
                rotationX: -90, // Flips the words in from the bottom
                stagger: {
                each: 0.05,
                from: "start" // Creates the wave effect from left to right
                }
            });

            gsap.from(span2.words, {
                scrollTrigger:{
                trigger: ".section-2",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                scale: 0, // Start scaled to nothing
                autoAlpha: 0,
                ease: "back.out(1.7)", // This ease creates the bouncy "pop"
                stagger: {
                amount: 0.05,
                from: "random",
                }
            });
            gsap.from(span3.lines, {
                scrollTrigger:{
                trigger: ".section-3",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                x: -200, // Slide the entire line in from the left
                autoAlpha: 0,
                stagger: {
                amount: 0.1
                }
            });
            gsap.from(span4.words, {
                scrollTrigger:{
                trigger: ".section-4",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                y: 80,
                rotationZ: 180, // Each word does a 180-degree spin
                autoAlpha: 0,
                stagger: {
                amount: 0.1,
                from: "center" // Animation radiates from the center word
                }
            });
            gsap.from(span5.words, {
                scrollTrigger:{
                trigger: ".section-5",
                start: "top 60%",
                end: "center 60%",
                scrub: 2, // A longer scrub makes it feel slower and floatier
                },
                y: 150, // Start far below
                autoAlpha: 0,
                ease: "power2.out", // A smooth, decelerating ease
                stagger: {
                amount: 0.1,
                from: "random"
                }
            });
            gsap.from(span6.words, {
                scrollTrigger:{
                trigger: ".section-6",
                start: "top 60%",
                end: "center 60%",
                scrub: 1,
                },
                y: 50,
                autoAlpha: 0,
                color: "#ff9a9e", // Start with a warm "toasted" color
                stagger: {
                amount: 0.1,
                from: "end" // A wave from right to left for a finishing feel
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
    });
}