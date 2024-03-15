export const getMentionIdsFromHtml = (html: string): string[] => {
  if (!html) return [];
  const mentionRegex =
    /<span class="mention" data-type="mention" data-id="(.+?)" data-label="(.+?)">(.+?)<\/span>/g;
  const mentionIds =
    html
      .match(mentionRegex)
      ?.map((mention) => mention.match(/data-id="(.+?)"/)?.[1]) || [];
  // remove undefined values and duplicates
  return Array.from(new Set(mentionIds.filter((id) => id))) as string[];
};
