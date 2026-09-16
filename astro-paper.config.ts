import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://damullins.com",
    author: "David Andrew Mullins",
    title: "Andrew Mullins",
    description: "Tech blog.",
    lang: "en",
    timezone: "America/New_York",
    dir: "ltr",
    ogImage: "site-og.jpg",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/DAMullins" },
    // Add other socials here if you want them to appear in the header/footer
  ],
  shareLinks: [
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "linkedin", url: "https://www.linkedin.com/shareArticle?mini=true&url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});