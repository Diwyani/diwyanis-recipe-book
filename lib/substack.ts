export type SubstackPost = {
  title: string;
  subtitle: string;
  link: string;
  image: string | null;
};

const FEED_URL = "https://diwyanivajpayee.substack.com/feed";

export const PINNED_FIRST_POST_LINK =
  "https://open.substack.com/pub/diwyanivajpayee/p/the-murder-mystery-that-taught-me?r=1m6p07&utm_campaign=post-expanded-share&utm_medium=web";

export const PINNED_SECOND_POST_LINK =
  "https://open.substack.com/pub/diwyanivajpayee/p/dinner-for-one-two-recipes?r=1m6p07&utm_campaign=post-expanded-share&utm_medium=post%20viewer";

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

    const allPosts = items.map(toPost);

    const first = allPosts.find((post) => post.link.includes("the-murder-mystery-that-taught-me"));
    if (first) first.link = PINNED_FIRST_POST_LINK;

    const second = allPosts.find((post) => post.link.includes("dinner-for-one-two-recipes"));
    if (second) second.link = PINNED_SECOND_POST_LINK;

    return [first, second].filter((post): post is SubstackPost => post != null).slice(0, limit);
  } catch {
    return [];
  }
}
