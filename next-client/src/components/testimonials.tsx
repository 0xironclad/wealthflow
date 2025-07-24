"use client"
import Image from "next/image"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import pfp from '@/assets/pfp.jpeg'
import pfp1 from '@/assets/pfp1.jpeg'
import pfp2 from '@/assets/pfp2.jpg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



interface Testimonial {
    id: number
    name: string
    role: string
    company: string
    rating: number
    content: string
    image: string
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Financial Advisor",
        company: "Morgan Stanley",
        rating: 5,
        content:
            "WealthFlow's AI-powered insights have revolutionized how I manage my clients' portfolios. The automated tracking and smart recommendations have helped us achieve better returns while saving countless hours of manual analysis.",
        image: pfp.src,
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Small Business Owner",
        company: "TechStart Inc",
        rating: 5,
        content:
            "As a business owner, keeping track of finances was always a challenge. WealthFlow's real-time tracking and budget planning features have given me complete control over my business finances. The AI chatbot is incredibly helpful for quick financial queries.",
        image: pfp1.src,
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Personal Finance Coach",
        company: "Financial Freedom",
        rating: 5,
        content:
            "I recommend WealthFlow to all my clients. The savings goals feature and interactive analytics make it easy for anyone to understand and improve their financial health. It's like having a financial advisor in your pocket!",
        image: pfp2.src,
    },
]

const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => {
                const starValue = i + 1
                return (
                    <Star
                        key={i}
                        className={`h-5 w-5 ${starValue <= rating
                            ? "fill-primary text-primary"
                            : starValue - 0.5 <= rating
                                ? "fill-primary/50 text-primary"
                                : "text-muted"
                            }`}
                    />
                )
            })}
        </div>
    )
}

export default function TestimonialsSection() {
    return (
        <section className="w-full py-24">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            What Our Customers Say
                        </h2>
                        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
                            Don&apos;t just take our word for it. See what developers and designers are saying about our components.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="relative h-full overflow-hidden hover:scale-105 hover:shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300" >
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between">
                                            <RatingStars rating={testimonial.rating} />
                                            <span className="text-4xl font-serif text-muted-foreground opacity-50">&rdquo;</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="mt-4 text-muted-foreground">{testimonial.content}</p>
                                        </div>
                                        <div className="mt-6 flex items-center">
                                            <div className="relative h-12 w-12">
                                                <Avatar>
                                                    <AvatarImage src={testimonial.image} />
                                                    <AvatarFallback>
                                                        {testimonial.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>

                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-semibold">{testimonial.name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {testimonial.role} @ {testimonial.company}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
