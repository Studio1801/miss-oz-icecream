import Story from '../components/Story';
import MeetOz from '../components/MeetOz';
import Reels from '../components/Reels';

export default function About() {
  return (
    <>
      <h1 className="sr-only">About Us</h1>
      <Story />
      <div id="oz"><MeetOz /></div>
      <Reels />
    </>
  );
}