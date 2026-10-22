export type PageMeta = {
  title: string;
  description: string;
};

export const NOT_FOUND_META: PageMeta = {
  title: 'Page Not Found | Miss Oz Ice Cream & Dessert Cafe',
  description: "We couldn't find that page. Return home or browse the Miss Oz menu.",
};

export const PUBLIC_ORIGIN = 'https://www.missozicecream.com';

export const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Miss Oz Ice Cream & Dessert Cafe, Portland, Oregon',
    description: "Small-batch handmade ice cream & desserts in Portland's Pearl District since 2007.",
  },
  '/about': {
    title: 'About Us | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Read the story of Miss Oz Ice Cream & Dessert Cafe and meet Oz in Portland’s Pearl District.',
  },
  '/wholesale': {
    title: 'Wholesale | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Explore Miss Oz ice cream and dessert wholesale offerings, and ask about becoming a partner.',
  },
  '/events': {
    title: 'Events | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Plan an event with Miss Oz Ice Cream & Dessert Cafe in Portland and send an event inquiry.',
  },
  '/contact': {
    title: 'Contact | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Find Miss Oz contact details and leave a note in the guestbook.',
  },
};

export const SEO_ROUTES = Object.keys(PAGE_META);