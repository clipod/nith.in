export const SITE = {
  website: "https://nith.in/",
  author: "Venkat Chinni",
  profile: "https://nith.in/about",
  desc: "Writing on software architecture, the systems that make enterprise AI trustworthy, and what my workshop teaches me about building reliable technology.",
  title: "nith.in",
  ogImage: "site-og-v2.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "America/Chicago",
} as const;
