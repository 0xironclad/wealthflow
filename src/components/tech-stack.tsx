"use client"

import React from "react"
import {
    SiNextdotjs,
    SiPostgresql,
    SiTailwindcss,
    SiDocker,
    SiGooglegemini,
    SiGit,
    SiGithub,
} from "react-icons/si"
import { Component } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dock, DockIcon } from "@/components/ui/dock"

export type IconProps = React.ComponentProps<"svg">

const DATA = {
    techStack: [
        {
            name: "Next.js",
            url: "https://nextjs.org",
            icon: SiNextdotjs,
        },
        {
            name: "PostgreSQL",
            url: "https://www.postgresql.org",
            icon: SiPostgresql,
        },
        {
            name: "Tailwind CSS",
            url: "https://tailwindcss.com",
            icon: SiTailwindcss,
        },
        {
            name: "Docker",
            url: "https://www.docker.com",
            icon: SiDocker,
        },
        {
            name: "shadcn/ui",
            url: "https://ui.shadcn.com",
            icon: Component,
        },
        {
            name: "Google Gemini",
            url: "https://deepmind.google/technologies/gemini",
            icon: SiGooglegemini,
        },
        {
            name: "Git",
            url: "https://git-scm.com",
            icon: SiGit,
        },
        {
            name: "GitHub",
            url: "https://github.com",
            icon: SiGithub,
        },
    ],
}

export function TechStack() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <span className="pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10">
                Technologies Used
            </span>
            <TooltipProvider>
                <Dock direction="middle">
                    {DATA.techStack.map((tech) => (
                        <DockIcon key={tech.name}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={tech.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={tech.name}
                                        className={cn(
                                            buttonVariants({ variant: "ghost", size: "icon" }),
                                            "size-12 rounded-full"
                                        )}
                                    >
                                        <tech.icon className="size-6" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{tech.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </DockIcon>
                    ))}
                </Dock>
            </TooltipProvider>
        </div>
    )
}
