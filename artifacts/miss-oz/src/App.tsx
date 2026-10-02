import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import About from '@/pages/about';
import Wholesale from '@/pages/wholesale';
import Events from '@/pages/events';
import Contact from '@/pages/contact';
import SiteLayout from '@/components/SiteLayout';
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';

const queryClient = new QueryClient();
const localBusinessSchema = document.querySelector<HTMLScriptElement>('#local-business-schema')?.textContent ?? '';

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    const page = PAGE_META[location] ?? PAGE_META['/'];
    document.title = page.title;
    const canonicalUrl = new URL(location === '/' ? '' : location.slice(1), 'https://www.missozicecream.com/').href;
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
    const anchor = window.location.hash.slice(1);
    if (anchor) {
      requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <SiteLayout showHero={location === '/'}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu"><Redirect to="/#menu" /></Route>
        <Route path="/new-flavor"><Redirect to="/#new-flavor" /></Route>
        <Route path="/about" component={About} />
        <Route path="/wholesale" component={Wholesale} />
        <Route path="/events" component={Events} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
  );
}

const PAGE_META: Record<string, { title: string; description: string }> = {
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
