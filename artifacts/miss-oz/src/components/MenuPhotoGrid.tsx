export type MenuPhotoGridItem = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};

export default function MenuPhotoGrid({ photos }: { photos: MenuPhotoGridItem[] }) {
  return (
    <div className="mx-auto grid w-full max-w-[560px] grid-cols-2 gap-[10px] sm:gap-[18px]">
      {photos.map((photo, index) => {
        const isUnpairedLastPhoto = photos.length % 2 === 1 && index === photos.length - 1;

        return (
          <figure
            key={photo.src}
            className={`overflow-hidden rounded-[12px] border border-[rgba(115,32,62,0.16)] bg-white/75 ${
              isUnpairedLastPhoto ? 'col-span-2 w-1/2 justify-self-center' : ''
            }`}
          >
            <img
              src={`${import.meta.env.BASE_URL}${photo.src}`}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="block aspect-square w-full object-cover"
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