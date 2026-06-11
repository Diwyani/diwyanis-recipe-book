export type SubstackPost = {
  title: string;
  subtitle: string;
  link: string;
  image: string | null;
};

const FEED_URL = "https://diwyanivajpayee.substack.com/feed";

export const PINNED_SECOND_POST_LINK =
  "https://diwyanivajpayee.substack.com/p/the-murder-mystery-that-taught-me";

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8212;/g, "—")
    .replace(/&#39;/g, "'");
}

function extractTag(item: string, tag: string): string {
  const match = item.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`));
  return match ? decodeEntities(match[1].trim()) : "";
}

export async function fetchSubstackPosts(limit = 2): Promise<SubstackPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const toPost = (item: string): SubstackPost => {
      const enclosure = item.match(/<enclosure url="([^"]*)"/);
      return {
        title: extractTag(item, "title"),
        subtitle: extractTag(item, "description"),
        link: extractTag(item, "link"),
        image: enclosure ? enclosure[1] : null,
      };
    };

    const latest = items[0] ? toPost(items[0]) : null;
    const pinned = items
      .map(toPost)
      .find((post) => post.link === PINNED_SECOND_POST_LINK);

    return [latest, pinned].filter((post): post is SubstackPost => post !== null && post !== undefined).slice(0, limit);
  } catch {
    return [];
  }
}
