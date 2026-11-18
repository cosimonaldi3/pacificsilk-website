/* "Learn more" links from the process page tiles to blog posts.
   Key: "<stage>:<tile>", the same id the tile uses (idBase of the bento + the tile key).
   Value: a post slug in content/blog.ts. A tile without an entry shows no link.
   Kept apart from content/blog.ts so the process page bundle does not carry every post. */
export const processLearnMore: Record<string, string> = {
  "define:insight": "china-makes-30-percent-of-the-worlds-goods",
  "define:trip": "modular-housing-visit-the-factory-before-you-ask-for-a-quote",
  "validate:suppliers": "how-to-read-a-chinese-business-licence",
  "validate:comms": "qa-can-i-run-a-china-project-without-travelling",
  "validate:logistics": "sea-rail-or-air-reading-a-route-comparison",
  "validate:sample": "the-golden-sample-one-approved-unit-sets-the-standard",
  "execute:quality": "factory-floor-tells-you-what-paperwork-cannot",
  "execute:paperwork": "customs-codes-why-the-code-decides-the-duty",
  "execute:issues": "qa-what-happens-when-production-goes-wrong",
  "beyond:fairs": "china-makes-30-percent-of-the-worlds-goods",
};
