import Image from "next/image"
import { TextEffect } from "@/components/ui/text-effect"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { HeroHeader } from "@/components/hero5-header"
import dashboard2 from "@/assets/dashboard2.png"
import { FeaturesSectionWithHoverEffects } from "@/components/feature-section-with-hover-effects"
import Bg from "@/assets/faded_gallery.jpg"
import { TestimonialsMarquee } from "@/components/testimonials-marquee"
import { TechStack } from "@/components/tech-stack"

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
                                    className="mt-3 text-balance text-3xl md:text-4xl lg:mt-5 xl:text-[3.25rem]"
                                >
                                    AI-Powered Financial Intelligence at Your Fingertips
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-12 max-w-2xl text-balance text-lg"
                                >
                                    Smart financial management with AI insights and automated tracking.
                                </TextEffect>


                            </div>
                        </div>

                        <div className="mx-auto max-w-4xl px-6">
                            <AnimatedGroup>
                                <div className="relative mt-6 overflow-hidden sm:mt-8 md:mt-15">
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
                                className="text-balance text-center text-2xl md:text-3xl lg:text-4xl"
                            >
                                Features
                            </TextEffect>
                        </AnimatedGroup>
                        <FeaturesSectionWithHoverEffects />
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="relative pt-16 md:pt-32" id="testimonials">
                    <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-32">
                        <AnimatedGroup>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h2"
                                className="text-balance text-center text-2xl md:text-3xl lg:text-4xl"
                            >
                                What Our Users Say
                            </TextEffect>
                        </AnimatedGroup>
                        <TestimonialsMarquee />
                    </div>
                </section>

                {/* Tech Stack Section */}
                <section className="relative pb-16 pt-16 md:pb-32 md:pt-32">
                    <div className="mx-auto max-w-4xl px-6">
                        <TechStack />
                    </div>
                </section>
            </main>
        </div>
    )
}
