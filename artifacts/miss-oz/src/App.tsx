import { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import SiteLayout from '@/components/SiteLayout';
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { PAGE_META, PUBLIC_ORIGIN } from './pageMeta';
import { AboutPage, ContactPage, EventsPage, WholesalePage } from './pageChunks';

const queryClient = new QueryClient();
const localBusinessSchema = document.querySelector<HTMLScriptElement>('#local-business-schema')?.textContent ?? '';

function ScrollToCurrentHash() {
  const [location] = useLocation();

  useEffect(() => {
    const scrollToHash = () => {
      const anchor = window.location.hash.slice(1);
      if (anchor) {
        requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
      } else {
        window.scrollTo(0, 0);
      }
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [location]);

  return null;
}

function RouteChunkFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[55vh] items-center justify-center px-6"
    >
      <span aria-hidden="true" className="text-[28px] text-[var(--gold)]">✦</span>
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    const page = PAGE_META[location] ?? PAGE_META['/'];
    document.title = page.title;
    const canonicalUrl = new URL(location === '/' ? '' : location.slice(1), `${PUBLIC_ORIGIN}/`).href;
    for (const [selector, content] of [
      ['meta[name="description"]', page.description],
      ['meta[property="og:title"]', page.title],
      ['meta[property="og:description"]', page.description],
      ['meta[property="og:url"]', canonicalUrl],
      ['meta[name="twitter:title"]', page.title],
      ['meta[name="twitter:description"]', page.description],
    ]) {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
    }
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = canonicalUrl;
    const schema = document.querySelector<HTMLScriptElement>('#local-business-schema');
    if (location === '/' && !schema && localBusinessSchema) {
      const script = document.createElement('script');
      script.id = 'local-business-schema';
      script.type = 'application/ld+json';
      script.textContent = localBusinessSchema;
      document.head.append(script);
    } else if (location !== '/') {
      schema?.remove();
    }
  }, [location]);

  return (
    <SiteLayout showHero={location === '/'}>
      <Suspense fallback={<RouteChunkFallback />}>
        <ScrollToCurrentHash />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu"><Redirect to="/#menu" /></Route>
          <Route path="/new-flavor"><Redirect to="/#new-flavor" /></Route>
          <Route path="/about" component={AboutPage} />
          <Route path="/wholesale" component={WholesalePage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </SiteLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
