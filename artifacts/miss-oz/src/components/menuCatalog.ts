/** Menu copy for the homepage menu. Keep these entries separate from its presentation
 * so the same real menu can be reused when the site eventually gains pages. */
export type MenuItem = {
  name: string;
  note?: string;
  seasonalLabel?: string;
};

export const MENU_CATEGORIES = ['Flavors', 'Sundaes', 'Croffles & Desserts', 'Drinks', 'Whole Cakes'] as const;

export const FLAVORS: MenuItem[] = [
  { name: 'Mexican Vanilla', note: 'Extra rich vanilla flavor from 4-fold vanilla extract.' },
  { name: 'Matcha', note: 'Ceremonial-grade matcha with an earthy, smooth flavor.' },
  { name: 'Kulfi', note: 'Traditional Indian cardamom & pistachio' },
  { name: 'Birthday Cake', note: 'Sweet yellow cake with confetti sprinkles.' },
  { name: 'Butter Pecan', note: 'Toasted pecans in our house-made Scotch sauce.' },
  { name: 'Salty Caramel', note: 'Buttery caramel with sea salt' },
  { name: 'Mint Chip', note: 'Fresh mint steeped with loose-leaf tea and mixed with semi-sweet chocolate chips.' },
  { name: 'Coffee Crackle', note: 'Coffee ice cream with chocolate crackle' },
  { name: 'Fresh Banana', note: 'Real banana. Naturally sweet' },
  { name: 'Belgian Chocolate', note: 'House-made chocolate base with premium Sudan cocoa powder.' },
  { name: 'Cookies & Cream', note: 'Oreo cookies folded into sweet cream.' },
  { name: 'Marionberry', note: 'Oregon marionberries in creamy goodness' },
];

export const SUNDAES: MenuItem[] = [
  { name: 'Miss Oz Cherry Crown Sundae', note: 'Three mini scoops and One single scoop topped with our house-made cherry syrup for a classic old-fashioned sundae.' },
  { name: 'Midnight Fudge Sundae', note: 'Two scoops with our house-made hot fudge, whipped cream, rainbow sprinkles and a cherry on top.' },
  { name: 'Rose City Banana Split', note: 'Vanilla, strawberry, and chocolate ice cream with three different sauces, topped with whipped cream, sprinkles, and cherries.' },
  { name: 'S’more Sundae', seasonalLabel: 'Seasonal F/W' },
];

export const CROFFLES: MenuItem[] = [
  { name: 'Fresh Banana', note: 'Fresh whipped cream, sliced bananas, and chocolate sauce.' },
  { name: 'Strawberry', note: 'Fresh whipped cream, fresh strawberries, and chocolate syrup.' },
  { name: 'Nutella', note: 'Nutella paired with fresh whipped cream.' },
  { name: 'Oreo', note: 'Fresh whipped cream topped with Oreo cookies.' },
  { name: 'Tiramisu', note: 'Fresh whipped cream and cocoa powder, creating a tiramisu-inspired flavor that pairs beautifully with the chewy, buttery croffle.' },
  { name: 'S’more Croffle Pop', seasonalLabel: 'Seasonal F/W' },
];

export const DESSERTS: MenuItem[] = [
  { name: 'Walnut Chocolate Chip Cookie', note: "Inspired by Levain Bakery's famous chunky cookies with a crisp exterior and soft, chewy center." },
  { name: 'Butter Pecan Cookie', note: "Inspired by Levain Bakery's chunky cookies with a crisp exterior and soft, chewy center." },
  { name: 'Traditional Chocolate Chip Cookie', note: 'A classic chocolate chip cookie with a crisp exterior and soft, chewy center.' },
  { name: 'Seasonal Dessert', note: 'See our Instagram or website for seasonal offerings.' },
];

export const DRINKS: MenuItem[] = [
  { name: 'Root Beer Float', note: 'Creamy house vanilla in an icy frosted mug' },
  { name: 'Coke Float', note: 'Classic cola with a generous scoop — simple perfection' },
  { name: 'Milkshakes', note: 'Blended thick & rich in any of our rotating flavors' },
];