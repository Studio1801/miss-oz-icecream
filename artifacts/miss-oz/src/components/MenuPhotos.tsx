export type FlavorPhoto = {
  name: string;
  fileName: string;
};

// Keep the supplied ice-cream photos mapped to their existing menu flavors.
export const FLAVOR_PHOTOS: FlavorPhoto[] = [
  { name: 'Matcha', fileName: 'image1.webp' },
  { name: 'Birthday Cake', fileName: 'image2.webp' },
  { name: 'Butter Pecan', fileName: 'image3.webp' },
  { name: 'Kulfi', fileName: 'image4.webp' },
  { name: 'Thai Iced Tea', fileName: 'image5.webp' },
  { name: 'Marionberry', fileName: 'image6.webp' },
  { name: 'Cookie and Cream', fileName: 'image7.webp' },
  { name: 'Belgian Chocolate', fileName: 'image8.webp' },
  { name: 'Coffee Crackle', fileName: 'image9.webp' },
  { name: 'Mint Chocolate Chip', fileName: 'image10.webp' },
];
