import Story from '../components/Story';
import MeetOz from '../components/MeetOz';
import DeferredReels from '../components/DeferredReels';

export default function About() {
  return (
    <>
      <h1 className="sr-only">About Us</h1>
      <div id="oz"><MeetOz /></div>
      <Story />
      <DeferredReels />
    </>
  );
}