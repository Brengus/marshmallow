import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function setupTextAnimations(){
  let span1 = new SplitText(".span1", { type: "words" });
  gsap.from(span1.words, {
    y: 60,
    opacity: 0,
    rotationX: -90, // Flips the words in from the bottom
    stagger: {
      each: 0.05,
      from: "start" // Creates the wave effect from left to right
    }
  });
  let span2 = new SplitText(".span2", { type: "words", wordsClass: "word" });
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

  let span3 = new SplitText(".span3", { type: "lines", linesClass: "line-parent" });
  let span3_words = new SplitText(".span3", { type: "words", wordsClass: "word" });
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

  // 4. Center-Outward Spin
  let span4 = new SplitText(".span4", { type: "words" });
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

  let span5 = new SplitText(".span5", { type: "words" });
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

  let span6 = new SplitText(".span6", { type: "words" });
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
}