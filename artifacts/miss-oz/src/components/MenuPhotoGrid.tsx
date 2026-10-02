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
  aspectRatio = 'square',
}: MenuPhotoGridProps) {
  const gridColumns = layout === 'sundaes'
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-2';
  const imageAspect = aspectRatio === 'portrait' ? 'aspect-[4/5]' : 'aspect-square';

  return (
    <div className={`mx-auto grid w-full max-w-[560px] ${gridColumns} gap-[10px] sm:gap-[18px]`}>
      {photos.map((photo, index) => {
        const isUnpairedLastPhoto = photos.length % 2 === 1 && index === photos.length - 1;
        const unpairedPhotoClass = layout === 'sundaes'
          ? 'md:col-span-2 md:w-1/2 md:justify-self-center lg:col-span-1 lg:w-full'
          : 'col-span-2 w-1/2 justify-self-center';

        return (
          <figure
            key={photo.src}
            className={`overflow-hidden rounded-[12px] border border-[rgba(115,32,62,0.16)] bg-white/75 ${
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