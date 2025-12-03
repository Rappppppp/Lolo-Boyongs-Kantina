"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function HomepageGallery() {
    const images = Array.from({ length: 6 }, (_, i) => `/resto/${i + 1}.jpg`);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + 1) % images.length);
    };

    const closeModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex(null);
    };

    // Keyboard navigation
    useEffect(() => {
        if (selectedIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                prevImage();
            } else if (e.key === "ArrowRight") {
                nextImage();
            } else if (e.key === "Escape") {
                setSelectedIndex(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, images.length]);

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {images.map((src, i) => (
                    <div
                        key={`gallery-${i}`}
                        className="group relative h-80 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setSelectedIndex(i)}
                    >
                        <img
                            src={src}
                            alt={`Gallery image ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                    </div>
                ))}
            </div>

            {/* Fullscreen Modal */}
            <Dialog
                open={selectedIndex !== null}
                onOpenChange={(open) => !open && setSelectedIndex(null)}
            >
                <DialogContent
                    className="max-w-[95vw] w-full h-[95vh] p-0 bg-black/95 border-0"
                >
                    <DialogTitle className="sr-only">Image Preview</DialogTitle>

                    {selectedIndex !== null && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Full-size image */}
                            <img
                                src={images[selectedIndex]}
                                alt={`Full-size preview ${selectedIndex + 1}`}
                                className="max-h-full max-w-full object-contain"
                            />

                            {/* Close button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/20 transition z-10"
                                aria-label="Close"
                            >
                                <X size={24} />
                            </button>

                            {/* Previous button */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20 transition z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={32} />
                            </button>

                            {/* Next button */}
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20 transition z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight size={32} />
                            </button>

                            {/* Image counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                                {selectedIndex + 1} / {images.length}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </>
    );
}