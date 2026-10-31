/** GA4 tracking for this client-side-routed website.
 * The Google tag is loaded only on public domains by index.html with
 * send_page_view: false. In GA4 Enhanced Measurement, browser-history-based
 * page views must remain disabled to prevent duplicates.
 */
export const MEASUREMENT_ID = 'G-GLK35N4XKD';

type Gtag = (...args: unknown[]) => void;
let previousPageLocation: string | null = null;

function getGtag(): Gtag | null {
  const fn = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof fn === 'function' ? fn : null;
}

/** Report a route change after the document title has been updated. */
export function trackPageView(path: string): void {
  const send = getGtag();
  if (!send) return;

  const pageLocation = window.location.href;
  send('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: pageLocation,
    page_referrer: previousPageLocation ?? document.referrer,
    send_to: MEASUREMENT_ID,
  });
  previousPageLocation = pageLocation;
}
