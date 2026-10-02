type MenuPhoto = { name: string; fileName: string };

// Millie's supplied product-to-photo mapping. Keep these as photos of menu items,
// not as additional menu products or wholesale offerings.
const flavorPhotos: MenuPhoto[] = [
  { name: 'Matcha', fileName: 'image1.jpeg' },
  { name: 'Birthday Cake', fileName: 'image2.jpeg' },
  { name: 'Butter Pecan', fileName: 'image3.jpeg' },
  { name: 'Kulfi', fileName: 'image4.jpeg' },
  { name: 'Thai Iced Tea', fileName: 'image5.jpeg' },
  { name: 'Marionberry', fileName: 'image6.jpeg' },
  { name: 'Cookie and Cream', fileName: 'image7.jpeg' },
  { name: 'Belgian Chocolate', fileName: 'image8.jpeg' },
  { name: 'Coffee Crackle', fileName: 'image9.jpeg' },
  { name: 'Mint Chocolate Chip', fileName: 'image10.jpeg' },
];

function PhotoGroup({ title, photos }: { title: string; photos: MenuPhoto[] }) {
  return (
    <div className="mt-7">
      <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--marionberry)]">
        {title}
      </h4>
      <div className="flex flex-wrap justify-center gap-3">
        {photos.map((photo) => (
          <figure
            key={photo.fileName}
            className="w-[calc(50%_-_0.375rem)] overflow-hidden rounded-[10px] border border-[rgba(115,32,62,0.16)] bg-white/75 sm:w-[calc(25%_-_0.5625rem)]"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/wholesale/${photo.fileName}`}
              alt={photo.name}
              width={960}
              height={1280}
              loading="lazy"
              decoding="async"
              className="block aspect-[4/5] w-full object-cover"
            />
            <figcaption className="px-2 py-2 text-center text-[12px] font-semibold leading-snug text-[var(--berry-deep)]" style={{ fontFamily: 'var(--font-sans)' }}>
              {photo.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function FlavorPhotos() {
  return <PhotoGroup title="Ice Cream Flavor" photos={flavorPhotos} />;
}
