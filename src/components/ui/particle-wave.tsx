"use client";

import { useEffect, useRef } from "react";

export function ParticleWave() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: { x: number; y: number; bx: number; by: number; size: number; phase: number }[] = [];
        const count = 1200; // Total particles
        // Enhanced color palette for the "Antigravity" look - using emerald/teal/green
        const colors = ["#10b981", "#34d399", "#059669", "#6ee7b7"];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                bx: Math.random() * width, // Base X
                by: Math.random() * height, // Base Y
                size: Math.random() * 2 + 0.5,
                phase: Math.random() * Math.PI * 2,
            });
        }

        let time = 0;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.005;

            // Create a "flow" effect using sine waves on both axes
            particles.forEach((p, i) => {
                // The "wave" math to simulate the organic liquid/particle flow
                // We distort the base position (bx, by) with sine waves

                // Horizontal flow
                p.x = p.bx + Math.sin(p.by * 0.003 + time * 2) * 50 + Math.sin(p.by * 0.01 + time) * 20;

                // Vertical wave
                p.y = p.by + Math.cos(p.bx * 0.003 + time * 1.5) * 50 + Math.cos(p.bx * 0.01 + time) * 20;

                // Perspective/Depth Size Pulse
                const sizePulse = Math.sin(p.phase + time) * 0.5 + 1;
                const currentSize = p.size * sizePulse;

                ctx.fillStyle = colors[i % colors.length];
                ctx.globalAlpha = Math.sin(p.phase + time) * 0.3 + 0.4; // Twinkle effect

                ctx.beginPath();
                ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-60 dark:opacity-40"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
