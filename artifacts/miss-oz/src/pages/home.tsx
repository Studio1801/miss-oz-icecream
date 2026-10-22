import Marquee from '../components/Marquee';
import FlavorStation from '../components/FlavorStation';
import Guestbook from '../components/Guestbook';

export default function Home() {
  return (
    <>
      <Marquee />
      <FlavorStation />
      <Guestbook id={undefined} />
    </>
  );
}