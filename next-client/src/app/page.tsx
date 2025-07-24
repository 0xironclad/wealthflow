import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { TextEffect } from "@/components/ui/text-effect"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { HeroHeader } from "@/components/hero5-header"
import dashboard2 from "@/assets/dashboard2.png"
import { FeaturesSectionWithHoverEffects } from "@/components/feature-section-with-hover-effects"
import Bg from "@/assets/faded_gallery.jpg"
import {ArrowRight} from 'lucide-react'
import TestimonialsSection from "@/components/testimonials"

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: "blur(12px)",
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Background Image Container */}
            <div className="fixed inset-0 -z-30">
                <Image
                    src={Bg}
                    alt="background"
                    className="object-cover w-full h-full dark:opacity-80 opacity-0"
                    fill
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background" />
            </div>

            <HeroHeader />
            <main className="relative overflow-hidden">
                {/* Hero Section */}
                <section>
                    <div className="relative pt-12 md:pt-36">
                        <div className="mx-auto max-w-4xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mt-3 text-balance text-4xl md:text-5xl lg:mt-5 xl:text-[4.25rem]"
                                >
                                    AI-Powered Financial Intelligence at Your Fingertips
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-4 max-w-2xl text-balance text-lg"
                                >
                                    Smart financial management with AI insights and automated tracking.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                                >
                                    {/* TODO: Add action buttons */}
                                    <Button key={1} asChild size="lg" variant="default" className="px-5">
                                        <Link href="#ai-in-action">
                                            <span className="text-nowrap">AI in Action</span>
                                            <ArrowRight className="ml-2 inline-block size-4" />
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <div className="mx-auto max-w-4xl px-6">
                            <AnimatedGroup>
                                <div className="relative mt-6 overflow-hidden sm:mt-8 md:mt-12">
                                    <div
                                        aria-hidden
                                        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/80 to-background"
                                    />
                                    <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-4xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                        <Image
                                            className="bg-background aspect-16/9 relative hidden rounded-2xl dark:block"
                                            src={dashboard2 || "/placeholder.svg"}
                                            alt="app screen"
                                            width="1800"
                                            height="960"
                                        />
                                        <Image
                                            className="z-2 border-border/25 aspect-16/9 relative rounded-2xl border dark:hidden"
                                            src={dashboard2 || "/placeholder.svg"}
                                            alt="app screen"
                                            width="1800"
                                            height="960"
                                        />
                                    </div>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative pt-16 md:pt-32" id="features">
                    <div className="mx-auto max-w-4xl px-6 pt-16 md:pt-32">
                        <AnimatedGroup>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h2"
                                className="text-balance text-center text-3xl md:text-4xl lg:text-5xl"
                            >
                                Features
                            </TextEffect>
                        </AnimatedGroup>
                        <FeaturesSectionWithHoverEffects />
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="relative pt-16 md:pt-32" id="testimonials">
                    <div className="mx-auto max-w-4xl px-6 pt-16 md:pt-32">
                        <AnimatedGroup>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h2"
                                className="text-balance text-center text-3xl md:text-4xl lg:text-5xl"
                            >
                                Testimonials
                            </TextEffect>
                        </AnimatedGroup>
                        <TestimonialsSection />
                    </div>
                </section>

                {/* Team Section */}
                <section className="relative pb-16 pt-16 md:pb-32">
                    <div className="mx-auto max-w-4xl px-6">
                        <div className="group relative">
                            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                                <Link href="/" className="block text-sm duration-150 hover:opacity-75">
                                    <span> Meet Our Team</span>

                                    <ChevronRight className="ml-1 inline-block size-3" />
                                </Link>
                            </div>
                            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                                <div className="flex">
                                    <Image
                                        className="mx-auto h-4 w-fit dark:invert"
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
                                        alt="GitHub Logo"
                                        height={150}
                                        width={150}
                                    />
                                </div>
                                <div className="flex">
                                    <Image
                                        className="mx-auto h-5 w-fit dark:invert"
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg"
                                        alt="Supabase Logo"
                                        height={150}
                                        width={150}
                                    />
                                </div>
                                <div className="flex">
                                    <Image
                                        className="mx-auto h-4 w-fit dark:invert"
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
                                        alt="NextJS Logo"
                                        height={150}
                                        width={150}
                                    />
                                </div>
                                <div className="flex">
                                    <Image
                                        className="mx-auto h-7 w-fit dark:invert"
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain-wordmark.svg"
                                        alt="NodeJS Logo"
                                        height={150}
                                        width={150}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
