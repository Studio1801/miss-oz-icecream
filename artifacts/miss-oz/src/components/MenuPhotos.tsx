export type FlavorPhoto = {
  name: string;
  src: string;
  alt?: string;
  objectPosition?: string;
};

// Keep each supplied ice-cream photo mapped to its menu flavor.
export const FLAVOR_PHOTOS: FlavorPhoto[] = [
  {
    name: 'Mexican Vanilla',
    src: 'images/mexican-vanilla.webp',
    alt: 'A scoop of Mexican vanilla ice cream in a silver dessert bowl against a pink backdrop.',
    objectPosition: '50% 62%',
  },
  { name: 'Matcha', src: 'images/wholesale/image1.webp', objectPosition: '50% 62%' },
  { name: 'Birthday Cake', src: 'images/wholesale/image2.webp', objectPosition: '50% 62%' },
  { name: 'Butter Pecan', src: 'images/wholesale/image3.webp', objectPosition: '50% 62%' },
  { name: 'Kulfi', src: 'images/wholesale/image4.webp', objectPosition: '50% 62%' },
  { name: 'Thai Iced Tea', src: 'images/wholesale/image5.webp', objectPosition: '50% 62%' },
  { name: 'Marionberry', src: 'images/wholesale/image6.webp', objectPosition: '50% 62%' },
  {
    name: 'Cookies & Cream',
    src: 'images/cookies-and-cream.webp',
    alt: 'A scoop of cookies and cream ice cream in a silver dessert bowl',
    objectPosition: '50% 62%',
  },
  { name: 'Belgian Chocolate', src: 'images/wholesale/image8.webp', objectPosition: '50% 62%' },
  { name: 'Coffee Crackle', src: 'images/wholesale/image9.webp', objectPosition: '50% 62%' },
  { name: 'Mint Chocolate Chip', src: 'images/wholesale/image10.webp', objectPosition: '50% 62%' },
  {
    name: 'Fresh Banana',
    src: 'images/fresh-banana.webp',
    alt: 'A scoop of fresh banana ice cream in a silver dessert bowl',
    objectPosition: '50% 100%',
  },
  {
    name: 'Horchata',
    src: 'images/horchata.webp',
    alt: 'Scoop of Horchata ice cream in a metal dish on a pink background.',
    objectPosition: '50% 62%',
  },
  {
    name: 'Salted Caramel',
    src: 'images/salted-caramel.webp',
    alt: 'Scoop of Salted Caramel ice cream in a metal dish on a pink background.',
    objectPosition: '50% 62%',
  },
  {
    name: 'Peanut Butter Fudge',
    src: 'images/peanut-butter-fudge.webp',
    alt: 'Scoop of Peanut Butter Fudge ice cream with chocolate fudge swirls in a metal dish on a pink background.',
    objectPosition: '50% 62%',
  },
];
