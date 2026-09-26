import Story from '../components/Story';
import MeetOz from '../components/MeetOz';
import Reels from '../components/Reels';

export default function About() {
  return (
    <>
      <Story />
      <div id="oz"><MeetOz /></div>
      <Reels />
    </>
  );
}