import React, { useEffect, useState, useRef } from "react";
import img1 from "@/assets/unb_campus_homepage_header_1.jpg";
// import img2 from '@/assets/unb_campus_homepage_header_2.jpg';
import img3 from "@/assets/unb_campus_homepage_header_3.jpg";
import img4 from "@/assets/Logo_long.png";

const IMAGES = [img1, img3, img4];
const INTERVAL_MS = 5000;

export const RotatingHeader: React.FC = () => {
    const [idx, setIdx] = useState(0);
    const ref = useRef<number | null>(null);
    useEffect(() => {
        ref.current = window.setInterval(
            () => setIdx((i) => (i + 1) % IMAGES.length),
            INTERVAL_MS
        );
        return () => {
            if (ref.current) window.clearInterval(ref.current);
        };
    }, []);
    return (
        <div className="relative h-72 w-full overflow-hidden border-b border-border bg-muted">
            {IMAGES.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    alt="Campus"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                        i === idx ? "opacity-100" : "opacity-0"
                    }`}
                    draggable={false}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-background/0" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {IMAGES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIdx(i)}
                        aria-label={`Go to image ${i + 1}`}
                        className={`h-2 w-2 rounded-full ${
                            i === idx
                                ? "bg-primary"
                                : "bg-foreground/30 hover:bg-foreground/60"
                        } transition`}
                    />
                ))}
            </div>
        </div>
    );
};
