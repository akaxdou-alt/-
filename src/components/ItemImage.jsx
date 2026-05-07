import { fallbackImage } from '../constants';

export function ItemImage({ src, alt, className = '' }) {
  return (
    <img
      src={src || fallbackImage}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.src = fallbackImage;
      }}
    />
  );
}
