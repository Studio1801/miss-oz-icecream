import { lazy } from 'react';

const loadAboutPage = () => import('./pages/about');
const loadWholesalePage = () => import('./pages/wholesale');
const loadEventsPage = () => import('./pages/events');
const loadContactPage = () => import('./pages/contact');

export const AboutPage = lazy(loadAboutPage);
export const WholesalePage = lazy(loadWholesalePage);
export const EventsPage = lazy(loadEventsPage);
export const ContactPage = lazy(loadContactPage);

const pageLoaders: Record<string, () => Promise<unknown>> = {
  '/about': loadAboutPage,
  '/wholesale': loadWholesalePage,
  '/events': loadEventsPage,
  '/contact': loadContactPage,
};

export function prefetchPageChunk(target: string) {
  if (typeof window === 'undefined') return;

  const url = new URL(target, window.location.href);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && url.pathname.startsWith(`${base}/`)
    ? url.pathname.slice(base.length)
    : url.pathname === base
      ? '/'
      : url.pathname;
  const loadPage = pageLoaders[path];

  if (loadPage) {
    void loadPage().catch((error: unknown) => {
      console.warn(`Could not prefetch the ${path} page chunk`, error);
    });
  }
}
