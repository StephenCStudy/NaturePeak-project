import React from "react";
import { HiLocationMarker } from "react-icons/hi";

type Props = {
  title: string;
  price?: number | string;
  area?: number | string;
  location?: string;
  image?: string;
  views?: number;
  createdAt?: string;
  onView?: () => void;
};

const PropertyCard: React.FC<Props> = ({
  title,
  price,
  area,
  location,
  image,
  views,
  createdAt,
  onView,
}) => {
  // Xác định xem có phải tin mới (đăng trong vòng 7 ngày)
  const isNew =
    createdAt &&
    (new Date().getTime() - new Date(createdAt).getTime()) /
      (1000 * 60 * 60 * 24) <=
      7;

  // Xác định xem có phải tin nổi bật (views > 100)
  const isPopular = (views || 0) > 100;
  return (
    <article className="group bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-50">
      <div className="h-56 bg-linear-to-br from-(--color-pastel) to-(--color-cream) relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`Image of ${title}`}
            className="prop-img w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-(--color-primary)"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <p className="text-sm">Hình ảnh</p>
            </div>
          </div>
        )}

        {/* Overlay with status badge */}
        {(isNew || isPopular) && (
          <div className="absolute top-3 right-3">
            {isNew ? (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg animate-pulse">
                ⭐ Tin mới
              </span>
            ) : isPopular ? (
              <span className="bg-(--color-accent) text-black text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                🔥 Tin nổi bật
              </span>
            ) : null}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-semibold text-lg text-[#083344] mb-2 line-clamp-2 group-hover:text-(--color-primary) transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted mb-4">
            <HiLocationMarker className="text-(--color-primary) shrink-0" />
            <span className="truncate">{location || "Chưa cập nhật"}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-(--color-primary) font-bold text-xl mb-1">
                {typeof price === "number"
                  ? price >= 1000000000
                    ? `${(price / 1000000000).toFixed(1)} tỷ`
                    : price >= 1000000
                    ? `${(price / 1000000).toFixed(0)} triệu`
                    : `${price.toLocaleString()} nghìn`
                  : price || "Thỏa thuận"}
              </div>
              <div className="text-sm text-muted flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                {area ? `${area} m²` : "Chưa rõ"}
              </div>
            </div>
          </div>

          <button
            onClick={onView}
            className="w-full btn-primary text-sm py-3 group-hover:bg-(--color-brown) transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Xem chi tiết</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
