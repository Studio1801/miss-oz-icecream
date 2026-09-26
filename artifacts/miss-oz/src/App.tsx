import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Menu from '@/pages/menu';
import NewFlavorPage from '@/pages/new-flavor';
import About from '@/pages/about';
import Wholesale from '@/pages/wholesale';
import Events from '@/pages/events';
import Contact from '@/pages/contact';
import SiteLayout from '@/components/SiteLayout';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    const page = PAGE_META[location] ?? PAGE_META['/'];
    document.title = page.title;
    for (const [selector, content] of [
      ['meta[name="description"]', page.description],
      ['meta[property="og:title"]', page.title],
      ['meta[property="og:description"]', page.description],
      ['meta[name="twitter:title"]', page.title],
      ['meta[name="twitter:description"]', page.description],
    ]) {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
    }
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = new URL(location.slice(1), 'https://www.missozicecream.com/').href;
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
        <Route path="/menu" component={Menu} />
        <Route path="/new-flavor" component={NewFlavorPage} />
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
    title: 'Miss Oz Ice Cream & Dessert Cafe — Portland, Oregon',
    description: "Small-batch handmade ice cream & desserts in Portland's Pearl District since 2007.",
  },
  '/menu': {
    title: 'Menu | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Browse Miss Oz ice cream flavors, sundaes, croffles, drinks, and handmade desserts.',
  },
  '/new-flavor': {
    title: 'New Flavor | Miss Oz Ice Cream & Dessert Cafe',
    description: 'See the new flavor and vote for a future Miss Oz ice cream flavor.',
  },
  '/about': {
    title: 'About Us | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Get to know Miss Oz Ice Cream & Dessert Cafe and meet Oz.',
  },
  '/wholesale': {
    title: 'Wholesale | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Explore Miss Oz wholesale offerings and flavors, and inquire about becoming a partner.',
  },
  '/events': {
    title: 'Events | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Find out about Miss Oz event catering and send an event inquiry.',
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
