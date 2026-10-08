import Marquee from '../components/Marquee';
import MenuSection from '../components/MenuSection';
import FlavorStation from '../components/FlavorStation';
import DeferredGuestbook from '../components/DeferredGuestbook';

export default function Home() {
  return (
    <>
      <Marquee />
      <MenuSection />
      <FlavorStation />
      <DeferredGuestbook />
    </>
  );
}