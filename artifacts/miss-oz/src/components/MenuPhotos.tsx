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
    objectPosition: 'center 56%',
  },
  {
    name: 'Salted Caramel',
    src: 'images/salted-caramel.webp',
    alt: 'A scoop of salted caramel ice cream in a silver dessert bowl against a pink backdrop.',
    objectPosition: 'center 56%',
  },
  { name: 'Matcha', src: 'images/wholesale/image1.webp' },
  { name: 'Birthday Cake', src: 'images/wholesale/image2.webp' },
  { name: 'Butter Pecan', src: 'images/wholesale/image3.webp' },
  { name: 'Kulfi', src: 'images/wholesale/image4.webp' },
  { name: 'Thai Iced Tea', src: 'images/wholesale/image5.webp' },
  { name: 'Marionberry', src: 'images/wholesale/image6.webp' },
  {
    name: 'Cookies & Cream',
    src: 'images/cookies-and-cream-pint.webp',
    alt: 'Cookies and cream ice cream with chocolate cookie pieces in a Miss Oz paper cup.',
  },
  { name: 'Belgian Chocolate', src: 'images/wholesale/image8.webp' },
  { name: 'Coffee Crackle', src: 'images/wholesale/image9.webp' },
  { name: 'Mint Chocolate Chip', src: 'images/wholesale/image10.webp' },
];
