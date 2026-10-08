import { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import SiteLayout from '@/components/SiteLayout';
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { NOT_FOUND_META, PAGE_META, PUBLIC_ORIGIN } from './pageMeta';
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
    const page = PAGE_META[location];
    const title = page?.title ?? NOT_FOUND_META.title;
    const description = page?.description ?? NOT_FOUND_META.description;
    document.title = title;

    const routeUrl = new URL(
      location === '/' ? '' : location.slice(1),
      `${PUBLIC_ORIGIN}/`,
    ).href;
    const metadata: Array<[string, string]> = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
    ];
    for (const [selector, content] of metadata) {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
    }

    const openGraphUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (openGraphUrl) {
      openGraphUrl.content = routeUrl;
    } else {
      const newOpenGraphUrl = document.createElement('meta');
      newOpenGraphUrl.setAttribute('property', 'og:url');
      newOpenGraphUrl.content = routeUrl;
      document.head.append(newOpenGraphUrl);
    }

    const canonicalUrl = page ? routeUrl : undefined;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    robots?.setAttribute('content', page ? 'index, follow' : 'noindex');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalUrl) {
      if (canonical) {
        canonical.href = canonicalUrl;
      } else {
        const newCanonical = document.createElement('link');
        newCanonical.rel = 'canonical';
        newCanonical.href = canonicalUrl;
        document.head.append(newCanonical);
      }
    } else {
      canonical?.remove();
    }

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
