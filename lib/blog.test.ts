import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { blogCategories, getAllPosts, getPopularTopics, getPostBySlug, getRelated, posts, readMinutes } from "../content/blog.ts";
import { processLearnMore } from "../content/blogLinks.ts";

const publicFile = (src: string) => join(import.meta.dirname, "..", "public", src);

test("every post has a unique slug and a valid category and date", () => {
  const slugs = posts.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  for (const p of posts) {
    assert.match(p.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `bad slug: ${p.slug}`);
    assert.ok(blogCategories.includes(p.category), `unknown category on ${p.slug}`);
    assert.ok(!Number.isNaN(Date.parse(p.date)), `bad date on ${p.slug}`);
    assert.ok(p.body.length > 0, `empty body on ${p.slug}`);
  }
});

test("every category has at least one post", () => {
  for (const c of blogCategories) {
    assert.ok(posts.some((p) => p.category === c), `no post in ${c}`);
  }
});

test("every photo a post uses exists in public/", () => {
  for (const p of posts) {
    const srcs = [p.image.src, ...p.body.flatMap((b) => (b.type === "image" ? [b.src] : []))];
    for (const src of srcs) assert.ok(existsSync(publicFile(src)), `missing ${src} (in ${p.slug})`);
  }
});

test("no post repeats its cover photo in the body", () => {
  for (const p of posts) {
    const inBody = p.body.flatMap((b) => (b.type === "image" ? [b.src] : []));
    assert.ok(!inBody.includes(p.image.src), `${p.slug} repeats its cover photo`);
    assert.equal(new Set(inBody).size, inBody.length, `${p.slug} repeats a body photo`);
  }
});

test("every photo has alt text", () => {
  for (const p of posts) {
    assert.ok(p.image.alt.length > 10, `alt too short on ${p.slug}`);
    for (const b of p.body) if (b.type === "image") assert.ok(b.alt.length > 10, `image alt too short in ${p.slug}`);
  }
});

test("every process learn-more link points to a real post", () => {
  for (const [tile, slug] of Object.entries(processLearnMore)) {
    assert.ok(getPostBySlug(slug), `${tile} links to missing post ${slug}`);
  }
});

test("getAllPosts sorts newest first without changing the list", () => {
  const sorted = getAllPosts();
  assert.equal(sorted.length, posts.length);
  for (let i = 1; i < sorted.length; i++) assert.ok(sorted[i - 1].date >= sorted[i].date);
});

test("getRelated never returns the post itself and prefers the same category", () => {
  const post = posts[0];
  const related = getRelated(post, 3);
  assert.equal(related.length, 3);
  assert.ok(!related.some((p) => p.slug === post.slug));
  assert.equal(related[0].category, post.category);
});

test("getPopularTopics is capped and ordered by use", () => {
  const topics = getPopularTopics(3);
  assert.equal(topics.length, 3);
  const count = (t: string) => posts.filter((p) => p.topics.includes(t)).length;
  assert.ok(count(topics[0]) >= count(topics[1]) && count(topics[1]) >= count(topics[2]));
});

test("readMinutes is at least one minute", () => {
  for (const p of posts) assert.ok(readMinutes(p) >= 1);
});
