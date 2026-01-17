"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { 
  ChevronLeft, 
  ChevronRight,
  Trophy, 
  Volleyball, 
  BowArrow,
  Gamepad2, 
  Puzzle, 
  Dice5,
  BookOpen,
  Telescope,
  LucideIcon,
  Rocket
} from "lucide-react"

interface Slide {
  tag: string
  title: string
  buttonText: string
  image: string
  tagColor?: string
  titleColor?: string
  buttonColor?: string
  backgroundColor?: string
  doodles?: LucideIcon[]
}

interface BannerCarouselProps {
  slides?: Slide[]
  autoPlayInterval?: number
}

export function BannerCarousel({
  slides = [
    {
      tag: "Go For Gold",
      title: "ACHIEVE\nGREATNESS",
      buttonText: "SHOP NOW",
      image: "/banner-1.jpg", 
      tagColor: "#ec008c",
      titleColor: "#393941ff",
      buttonColor: "#ec008c",
      backgroundColor: "#fff0fdff",
      doodles: [Trophy, Volleyball, BowArrow],
    },
    {
      tag: "Creative Play",
      title: "BUILD YOUR\nIMAGINATION",
      buttonText: "EXPLORE",
      image: "/banner-2.avif",
      tagColor: "#f7941d",
      titleColor: "#393941ff",
      buttonColor: "#f7941d",
      backgroundColor: "#fff8f0",
      doodles: [Puzzle, Gamepad2, Dice5],
    },
    {
      tag: "Fun Learning",
      title: "DISCOVER\nNEW WORLDS",
      buttonText: "LEARN MORE",
      image: "/banner-3.jpg",
      tagColor: "#00d3d5",
      titleColor: "#393941ff",
      buttonColor: "#00d3d5",
      backgroundColor: "#f0fcff",
      doodles: [BookOpen, Telescope, Rocket],
    },
  ],
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [slides.length, autoPlayInterval])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const currentSlideData = slides[currentSlide]

  const doodlePositions = [
    "top-[12%] left-[5%] rotate-[-12deg]",
    "bottom-[10%] left-[25%] rotate-[12deg]",
    "top-[20%] left-[35%] rotate-[-6deg]",
  ]

  return (
    <section
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden flex items-center transition-colors duration-700"
      style={{ backgroundColor: currentSlideData.backgroundColor }}
    >
      <div className="absolute inset-y-0 right-0 w-full md:w-[60%] h-full z-0 bg-gray-200">
        <Image
          src={currentSlideData.image || "/placeholder.svg"}
          alt={currentSlideData.title}
          fill
          className="object-cover object-center transition-opacity duration-700"
          priority
        />
      </div>

      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full transition-all duration-700 drop-shadow-[-10px_0_20px_rgba(0,0,0,0.1)]"
          style={{ fill: currentSlideData.backgroundColor }}
        >
          <path d="M0,0 L45,0 Q60,50 45,100 L0,100 Z" />
        </svg>
      </div>

      {currentSlideData.doodles?.map((Icon, index) => (
        <div
          key={`${currentSlide}-${index}`}
          className={`absolute z-20 hidden md:block ${doodlePositions[index] || ""}`}
          style={{ 
            color: currentSlideData.tagColor,
            opacity: 0.35
          }}
        >
          <Icon size={index === 1 ? 80 : 70} strokeWidth={1.5} />
        </div>
      ))}

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 h-full items-center">
        <div className="pt-20 md:pt-0 pl-4 md:pl-12">
          <span
            className="font-[family-name:var(--font-patrick)] text-2xl md:text-3xl block mb-4 transition-colors duration-700"
            style={{ color: currentSlideData.tagColor }}
          >
            {currentSlideData.tag}
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-rampart)] font-[weight:500] leading-tight mb-8 tracking-tight whitespace-pre-line transition-colors duration-700"
            style={{ color: currentSlideData.titleColor }}
          >
            {currentSlideData.title}
          </h1>
          <button
            className="text-white font-[family-name:var(--font-patrick)] text-sm font-bold tracking-wider py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ backgroundColor: currentSlideData.buttonColor }}
          >
            {currentSlideData.buttonText}
          </button>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center text-gray-800 hover:text-[#ff6b6b] hover:scale-110 transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center text-gray-800 hover:text-[#ff6b6b] hover:scale-110 transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-[#ff6b6b] w-8" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
      <svg
  viewBox="0 0 100 100"
  className="absolute bottom-0 left-0 w-40 h-40 z-20"
>
  <path
    d="M 0,0 Q 100,20 100,100"
    fill="none"
    stroke={currentSlideData.tagColor || '#ec008c'}
    strokeWidth="2"
    strokeDasharray="5,6"
    strokeLinecap="round"
    opacity="0.4"
  />
</svg>
    </section>
  )
}
