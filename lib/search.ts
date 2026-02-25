import { Type } from "@google/genai";

export interface LinkData {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  externalUrl: string;
  metaDescription: string;
  content: string;
  faqs: { question: string; answer: string }[];
  keywords: string[];
}

export const searchLinks = (links: LinkData[], query: string): LinkData[] => {
  if (!query) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const tokens = normalizedQuery.split(/\s+/).filter(t => t.length > 1);

  // Simple synonym dictionary for common terms
  const synonyms: Record<string, string[]> = {
    "check": ["verify", "status", "track", "dekhe", "dekhen", "dekho"],
    "verify": ["check", "status", "track"],
    "track": ["status", "check", "where", "location"],
    "udyam": ["msme", "business", "udyog"],
    "aadhar": ["adhar", "uidai", "id"],
    "voter": ["election", "vote", "epic"],
    "license": ["dl", "driving", "rto"],
    "pan": ["tax", "income", "pancard"],
    "money": ["paisa", "payment", "refund", "kisan"]
  };

  const getRelatedTokens = (token: string) => {
    const related = [token];
    for (const [key, values] of Object.entries(synonyms)) {
      if (key === token || values.includes(token)) {
        related.push(key, ...values);
      }
    }
    return [...new Set(related)];
  };

  const allQueryTokens = tokens.flatMap(getRelatedTokens);

  return links
    .map(link => {
      let score = 0;
      const title = link.title.toLowerCase();
      const desc = link.shortDescription.toLowerCase();
      const content = link.content.toLowerCase();
      const keywords = link.keywords.map(k => k.toLowerCase());

      // Exact title match (highest weight)
      if (title.includes(normalizedQuery)) score += 100;

      // Token matches
      allQueryTokens.forEach(token => {
        if (title.includes(token)) score += 20;
        if (keywords.some(k => k.includes(token))) score += 15;
        if (desc.includes(token)) score += 10;
        if (content.includes(token)) score += 5;
      });

      // Fuzzy-ish matching (very basic)
      if (score === 0 && tokens.length > 0) {
        tokens.forEach(token => {
          // Check if at least 70% of characters match in sequence
          if (title.split('').filter(c => token.includes(c)).length > token.length * 0.7) {
            score += 5;
          }
        });
      }

      return { link, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.link);
};
