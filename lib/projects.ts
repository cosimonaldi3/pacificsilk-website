import { projects } from "@/content/projects";
import { posts } from "@/content/posts";
import type { Project, Post } from "@/lib/types";

// V1: reads from content/ files. All functions are async so a future Airtable
// swap (fetch + revalidate) only touches this file — pages never import content/ directly.

export async function getAllProjects(): Promise<Project[]> {
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return projects.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  return posts;
}
