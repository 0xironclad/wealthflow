"use client"

import { useEffect, useState } from "react"

interface Position {
    x: number
    y: number
}

export function GlowCursor() {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <>
            {/* Main glow */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 0, 0.15), transparent 20%)`,
                }}
            />
            {/* Subtle background glow */}
            <div
                className="pointer-events-none fixed inset-0 z-20 opacity-50 transition duration-300"
                style={{
                    background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, var(--glow-secondary), transparent 40%)`,
                }}
            />
        </>
    )
}
