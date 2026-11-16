import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import GalleryClient from "@/components/sections/GalleryClient";
import { galleryItems } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery | Pacific Silk Consulting",
  description:
    "A visual record of Pacific Silk Consulting's work across China and global markets.",
};

export default function GalleryPage() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Nav />
      <main className="flex-1 min-h-0 overflow-hidden">
        <GalleryClient items={galleryItems} />
      </main>
    </div>
  );
}
