import type { AnchorHTMLAttributes, MouseEvent, ReactElement, ReactNode } from 'react';
import { Link } from 'wouter';

export const SITE_NAV_LINKS = [
  { label: 'Home', target: '/' },
  { label: 'Events', target: '/events' },
  { label: 'Wholesale', target: '/wholesale' },
  { label: 'About Us', target: '/about' },
  { label: 'Contact', target: '/contact' },
];

const APP_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const sectionTarget = (id: string, isHome: boolean) => `${isHome ? '' : '/'}#${id}`;

export const navTarget = (target: string, showHero: boolean) =>
  showHero && target === '/contact' ? '#visit' : target;

export const handleSameRouteNavigation = (target: string, event: MouseEvent<Element>) => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

  const browserTarget = target.startsWith('#') ? target : `${APP_BASE}${target}`;
  const url = new URL(browserTarget, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;

  if (!url.hash) {
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
    return;
  }

  const anchorId = decodeURIComponent(url.hash.slice(1));
  window.requestAnimationFrame(() => document.getElementById(anchorId)?.scrollIntoView());
};

type SiteNavigationLinkBaseProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };
type SiteNavigationLinkProps = SiteNavigationLinkBaseProps & (
  | { asChild?: false; children?: ReactNode }
  | { asChild: true; children: ReactElement }
);

export function SiteNavigationLink(props: SiteNavigationLinkProps) {
  const { to, onClick } = props;
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    handleSameRouteNavigation(to, event);
    onClick?.(event);
  };

  if (props.asChild) {
    return <Link {...props} to={to} onClick={handleClick} />;
  }

  return <Link {...props} to={to} onClick={handleClick} />;
}
