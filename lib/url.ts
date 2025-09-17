export const getCleanUrl = (url: string) => {
  try {
    const u = new URL(url);
    // Remove search params
    u.search = "";
    // Remove https://
    let cleaned = u.toString();
    cleaned = cleaned.replace(/^https:\/\//, "");
    // Remove trailing slash if present
    if (cleaned.endsWith("/")) {
      cleaned = cleaned.slice(0, -1);
    }
    return decodeURIComponent(cleaned);
  } catch {
    return url;
  }
};
