"use client";

import { useState } from "react";
import Image from "next/image";

interface FoodImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
}

export default function FoodImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  imgClassName = "",
}: FoodImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden bg-stone-200">
      {failed ? (
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-200 via-amber-50 to-stone-300"
          role="img"
          aria-label={alt}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
