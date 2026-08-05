import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'SPONSORED',
    title: 'Hybrid Cloud Multimedia Storage',
    desc: 'Separates binary asset storage from metadata indexing for 10x retrieval speeds.',
    bg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80',
    cta: 'Explore Architecture',
    color: '#f97316'
  },
  {
    id: 2,
    tag: 'NEURO FEATURE',
    title: 'SHA-256 Duplicate Collision Safeguard',
    desc: 'Automated cryptographic fingerprinting prevents redundant file uploads & saves disk footprint.',
    bg: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&q=80',
    cta: 'Check SHA System',
    color: '#3b82f6'
  },
  {
    id: 3,
    tag: 'AI PROTOTYPE',
    title: 'Smart Lossless Compression & Vector Search',
    desc: 'Perceptual waveform optimization & face feature vector linking across datasets.',
    bg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&q=80',
    cta: 'Try AI Tools',
    color: '#10b981'
  }
];

export default function HeroCarousel({ onSelectSlideCta }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div class="px-6 mb-6">
      <div class="max-w-4xl mx-auto relative h-[176px] rounded-[24px] overflow-hidden shadow-active-job group border border-gray-100">
        {/* Carousel Slide Track */}
        <div
          class="flex h-full carousel-slide-transition"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div key={slide.id} class="min-w-full h-full relative flex items-end p-6 select-none">
              {/* Background Image */}
              <img
                src={slide.bg}
                alt={slide.title}
                class="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Bottom-heavy gradient overlay */}
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Content */}
              <div class="relative z-10 max-w-[85%]">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="text-[9px] font-extrabold tracking-wider uppercase text-[#f97316] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md border border-[#f97316]/30">
                    {slide.tag}
                  </span>
                </div>
                <h2 class="text-[18px] font-bold text-white leading-snug mb-1 drop-shadow-sm">
                  {slide.title}
                </h2>
                <p class="text-[11px] text-white/80 line-clamp-1 mb-2 font-medium">
                  {slide.desc}
                </p>

                <button
                  onClick={() => onSelectSlideCta && onSelectSlideCta(slide)}
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#f97316] hover:bg-[#ea580c] px-3 py-1 rounded-full transition-all active:scale-95 shadow-sm"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight class="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Ad Navigation Dots (Absolute position bottom-4, right-6) */}
        <div class="absolute bottom-4 right-6 z-20 flex items-center gap-[6px]">
          {SLIDES.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                class={`pill-active-transition rounded-full h-[6px] ${
                  isActive ? 'w-[16px] bg-white' : 'w-[6px] bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
