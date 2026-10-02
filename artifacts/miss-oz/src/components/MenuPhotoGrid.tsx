export type MenuPhotoGridItem = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};

type MenuPhotoGridProps = {
  photos: MenuPhotoGridItem[];
  layout?: 'standard' | 'sundaes';
  aspectRatio?: 'square' | 'portrait';
};

export default function MenuPhotoGrid({
  photos,
  layout = 'standard',
  aspectRatio = 'portrait',
}: MenuPhotoGridProps) {
  const desktopColumns = layout === 'sundaes' ? 3 : Math.max(1, Math.min(3, photos.length));
  const desktopGridColumns = desktopColumns === 3
    ? 'xl:grid-cols-3'
    : desktopColumns === 2
      ? 'xl:grid-cols-2'
      : 'xl:grid-cols-1';
  const gridColumns = `grid-cols-1 md:grid-cols-2 ${desktopGridColumns}`;
  const imageAspect = aspectRatio === 'portrait' ? 'aspect-[4/5]' : 'aspect-square';
  const unpairedPhotoClass = 'md:col-span-2 md:w-1/2 md:justify-self-center xl:col-span-1 xl:w-full';

  return (
    <div className={`mx-auto grid w-full max-w-[760px] ${gridColumns} gap-[20px]`}>
      {photos.map((photo, index) => {
        const isUnpairedLastPhoto = photos.length % 2 === 1 && index === photos.length - 1;

        return (
          <figure
            key={photo.src}
            className={`w-full max-w-[240px] justify-self-center overflow-hidden rounded-[12px] border border-[rgba(115,32,62,0.16)] bg-white/75 ${
              isUnpairedLastPhoto ? unpairedPhotoClass : ''
            }`}
          >
            <img
              src={`${import.meta.env.BASE_URL}${photo.src}`}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className={`block ${imageAspect} w-full object-cover`}
              style={{ objectPosition: photo.objectPosition }}
            />
            <figcaption
              className="bg-[var(--berry-deep)] px-2 py-2.5 text-center text-[12px] font-semibold leading-snug text-[var(--cream-hi)]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {photo.caption}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}