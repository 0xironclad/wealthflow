"use client"

import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"

const reviews = [
  {
    name: "Sarah Johnson",
    username: "@sarahj_finance",
    body: "WealthFlow transformed how I manage my finances. The AI insights helped me save 30% more each month!",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Michael Chen",
    username: "@mchen_tech",
    body: "The budget tracking is incredibly intuitive. I finally understand where my money goes. Best financial app I've used.",
    img: "https://avatar.vercel.sh/michael",
  },
  {
    name: "Emily Rodriguez",
    username: "@emily_saves",
    body: "The AI chatbot is like having a personal financial advisor 24/7. It answered all my questions instantly!",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "David Thompson",
    username: "@dthompson_biz",
    body: "As a freelancer, tracking income and expenses was a nightmare. WealthFlow made it effortless. Highly recommend!",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Priya Patel",
    username: "@priya_goals",
    body: "I reached my savings goal 3 months early thanks to the smart recommendations. This app is a game-changer!",
    img: "https://avatar.vercel.sh/priya",
  },
  {
    name: "James Wilson",
    username: "@jwilson_money",
    body: "The real-time insights and beautiful dashboard make financial planning actually enjoyable. Love this app!",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Lisa Anderson",
    username: "@lisa_budget",
    body: "Finally, a finance app that's both powerful and easy to use. The AI features are incredibly accurate!",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "Alex Kumar",
    username: "@alex_invests",
    body: "WealthFlow helped me identify spending patterns I never noticed. Now I'm saving more without feeling restricted.",
    img: "https://avatar.vercel.sh/alex",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function TestimonialsMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-8">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}

