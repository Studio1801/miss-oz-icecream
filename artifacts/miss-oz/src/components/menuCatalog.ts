/** Menu copy for the homepage menu. Keep these entries separate from its presentation
 * so the same real menu can be reused when the site eventually gains pages. */
export type MenuItem = {
  name: string;
  price?: string;
  note?: string;
  seasonalLabel?: string;
};

export const MENU_CATEGORIES = ['Flavors', 'Sundaes', 'Croffles & Desserts', 'Drinks', 'Whole Cakes'] as const;

export const UBEREATS_URL = 'https://www.ubereats.com/store/miss-oz-ice-cream-cafe-aka-cool-moon-ice-creams/YEfj7ZgZS2m7Wm2og7PphQ';

export type MenuPhoto = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};

export const SUNDAE_PHOTOS: MenuPhoto[] = [
  {
    src: 'images/cherry-crown-sundae.webp',
    alt: 'Miss Oz Cherry Crown Sundae with scoops of ice cream, cherries, and cherry syrup in a glass dish.',
    caption: 'Miss Oz Cherry Crown Sundae',
    objectPosition: 'center 52%',
  },
  {
    src: 'images/midnight-fudge-sundae-v2.webp',
    alt: 'Midnight Fudge Sundae in a glass dish with ice cream, chocolate fudge, whipped cream, rainbow sprinkles and a cherry on a doily-lined plate',
    caption: 'Midnight Fudge Sundae',
    objectPosition: 'center 52%',
  },
  {
    src: 'images/wholesale/image11.webp',
    alt: 'Rose City Banana Split with vanilla, strawberry, and chocolate scoops, sauces, whipped cream, sprinkles, and cherries',
    caption: 'Rose City Banana Split',
  },
  {
    src: 'images/wholesale/image12.webp',
    alt: "S'more sundae with a toasted marshmallow, graham crackers, whipped cream and chocolate drizzle",
    caption: "S'more Sundae",
    objectPosition: 'center top',
  },
];

export const DESSERT_PHOTOS: MenuPhoto[] = [
  {
    src: 'images/walnut-chocolate-chip-cookie-client.png',
    alt: 'Walnut chocolate chip cookies, thick and chunky, stacked on a green checkered paper-lined plate',
    caption: 'Walnut Chocolate Chip Cookie',
    objectPosition: 'center 56%',
  },
  {
    src: 'images/butter-pecan-cookie-client.png',
    alt: 'A butter pecan cookie, thick and chunky with pecan pieces and chocolate chips, on a green checkered paper-lined plate',
    caption: 'Butter Pecan Cookie',
  },
  {
    src: 'images/cookie-chocolate-chip-new.webp',
    alt: 'A stack of chocolate chip cookies with crisp golden edges on a green checkered paper-lined plate',
    caption: 'Traditional Chocolate Chip Cookie',
    objectPosition: 'center 48%',
  },
];

export const CAKE_PHOTOS: MenuPhoto[] = [
  {
    src: 'images/whole-cheesecake-slice.webp',
    alt: 'A slice of Original Basque Cheesecake',
    caption: 'Basque Cheesecake Slice',
  },
  {
    src: 'images/whole-basque-cheesecake.webp',
    alt: 'A whole Original Basque Cheesecake',
    caption: 'Whole Basque Cheesecake',
  },
];

export const FLAVORS: MenuItem[] = [
  { name: 'Mexican Vanilla', note: 'Extra rich vanilla flavor from 4-fold vanilla extract.' },
  { name: 'Thai Iced Tea', note: 'Made with Cha Thai tea leaves we steep ourselves, bringing the distinctive aroma and rich, creamy flavor of Thai iced tea to every scoop.' },
  { name: 'Kulfi', note: 'Our ice cream interpretation of kulfi, a traditional Indian frozen dairy dessert, with fragrant cardamom and pistachios.' },
  { name: 'Matcha', note: 'Ceremonial-grade matcha with an earthy, smooth flavor.' },
  { name: 'Birthday Cake', note: 'Sweet yellow cake with confetti sprinkles.' },
  { name: 'Oregon Marionberry', note: 'Oregon marionberries in creamy goodness' },
  { name: 'Butter Pecan', note: 'Toasted pecans in our house-made Scotch sauce.' },
  { name: 'Coffee Crackle', note: 'Coffee ice cream with chocolate crackle' },
  { name: 'Fresh Banana', note: 'We ripen fresh bananas in our kitchen until they reach their sweetest, then turn them into ice cream full of naturally rich banana flavor.' },
  { name: 'Belgian Chocolate', note: 'House-made chocolate base with premium Sudan cocoa powder.' },
  { name: 'Mint Chocolate Chip', note: 'We steeped teas for a gentle, lingering mint flavor, finished with the sweetness of semi-sweet chocolate chips. Naturally pale, with no artificial colors.' },
  { name: 'Cookies & Cream', note: 'Chocolate sandwich cookies folded into sweet cream.' },
  { name: 'Horchata', note: "Mexico's beloved national drink, churned into ice cream. Made from scratch with Miss Oz's handmade recipe." },
  { name: 'Salted Caramel', note: 'Slow-cooked caramel with a touch of sea salt, churned into sweet cream.' },
  { name: 'Peanut Butter Fudge', note: 'Rich, creamy peanut butter ice cream swirled with our house-made chocolate fudge for the perfect balance of nutty sweetness and chocolatey indulgence.' },
];

export const SUNDAES: MenuItem[] = [
  { name: 'Miss Oz Cherry Crown Sundae', note: 'Three mini scoops and one single scoop topped with our house-made cherry syrup for a classic old-fashioned sundae.' },
  { name: 'Midnight Fudge Sundae', note: 'Two scoops with our house-made hot fudge, whipped cream, rainbow sprinkles and a cherry on top.' },
  { name: 'Rose City Banana Split', note: 'Vanilla, strawberry, and chocolate ice cream with three different sauces, topped with whipped cream, sprinkles, and cherries.' },
  { name: 'S’more Sundae', seasonalLabel: 'Seasonal, fall and winter' },
];

export const CROFFLES: MenuItem[] = [
  { name: 'Fresh Banana', note: 'Fresh whipped cream, sliced bananas, and chocolate sauce.' },
  { name: 'Strawberry', note: 'Fresh whipped cream, fresh strawberries, and chocolate syrup.' },
  { name: 'Nutella', note: 'Nutella paired with fresh whipped cream.' },
  { name: 'Oreo', note: 'Fresh whipped cream topped with Oreo cookies.' },
  { name: 'Tiramisu', note: 'Fresh whipped cream and cocoa powder, creating a tiramisu-inspired flavor that pairs beautifully with the chewy, buttery croffle.' },
  { name: 'S’more Croffle Pop', seasonalLabel: 'Seasonal, fall and winter' },
];

export const CROFFLE_PHOTOS: MenuPhoto[] = [
  {
    src: 'images/banana-croffle-pop.webp',
    alt: 'Fresh Banana croffle pop topped with banana slices, whipped cream, and chocolate sauce.',
    caption: 'Fresh Banana',
    objectPosition: 'center 46%',
  },
  {
    src: 'images/strawberry-croffle-pop.webp',
    alt: 'Strawberry croffle pop topped with fresh strawberries, whipped cream, and chocolate drizzle.',
    caption: 'Strawberry',
    objectPosition: 'center 42%',
  },
  {
    src: 'images/nutella-croffle.webp',
    alt: 'Nutella croffle topped with chocolate hazelnut spread, whipped cream, and powdered sugar.',
    caption: 'Nutella',
    objectPosition: 'center 52%',
  },
];

export const DESSERTS: MenuItem[] = [
  { name: 'Walnut Chocolate Chip Cookie', note: 'New York-style thick and chunky cookie, crispy edges with a gooey center.' },
  { name: 'Butter Pecan Cookie', note: 'New York-style thick and chunky cookie, crispy edges with a gooey center.' },
  { name: 'Traditional Chocolate Chip Cookie', note: 'A classic chocolate chip cookie with a crisp exterior and soft, chewy center.' },
  { name: 'Seasonal Dessert', note: 'See our Instagram or website for seasonal offerings.' },
];

export const DRINKS: MenuItem[] = [
  { name: 'Root Beer Float', note: "Dad's Root Beer with one scoop of vanilla ice cream." },
  { name: 'Coke Float', note: 'Mexican Coke with a generous scoop of vanilla ice cream.' },
  { name: 'Milkshakes', note: 'Blended thick & rich in any of our rotating flavors' },
];