"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particles
    const particles = Array.from({ length: 30 }, (_, i) => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-green-400 rounded-full opacity-20';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      container.appendChild(particle);
      particlesRef.current.push(particle);
      return particle;
    });

    // Animate particles
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        x: `${Math.random() * 200 - 100}px`,
        y: `${Math.random() * 200 - 100}px`,
        duration: 10 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });

      gsap.to(particle, {
        opacity: Math.random() * 0.5 + 0.1,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });
    });

    return () => {
      particles.forEach(particle => particle.remove());
      particlesRef.current = [];
    };
  }, []);

  return (
    <>
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-green-950/10 to-black" />
      
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-green-600/10 via-green-800/5 to-transparent rounded-full animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-green-400/10 via-green-600/5 to-transparent rounded-full animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Floating Particles Container */}
      <div ref={containerRef} className="fixed inset-0 pointer-events-none" />
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')]" />
    </>
  );
}