import React, { useState } from "react";
import { HiLocationMarker, HiSearch } from "react-icons/hi";

const HeroSearch: React.FC<{ onSearch?: (q: any) => void }> = ({
  onSearch,
}) => {
  const [q, setQ] = useState("");
  const [ptype, setPtype] = useState<"all" | "apartment" | "land">("all");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { q };
    if (ptype && ptype !== "all") payload.propertyType = ptype;
    onSearch?.(payload);
  };

  return (
    <section className="relative bg-linear-to-br from-(--color-pastel) via-white to-(--color-cream) rounded-3xl overflow-hidden shadow-soft mb-12">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-(--color-accent) opacity-10 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-(--color-primary) opacity-10 rounded-full translate-x-12 translate-y-12"></div>

      <div className="relative z-10 px-8 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#083344] mb-6 leading-tight">
            Tìm nhà đất{" "}
            <span className="text-(--color-primary) relative">
              gần thiên nhiên
              <svg
                className="absolute -bottom-2 left-0 w-full h-3"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-(--color-accent)"
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Khám phá những bất động sản đẹp nhất vùng ven, được tuyển chọn kỹ
            càng với không gian xanh và môi trường trong lành
          </p>

          <form
            onSubmit={submit}
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Search Input */}
              <div className="md:col-span-6">
                <label className="block text-sm font-semibold text-[#083344] mb-2">
                  Địa điểm & từ khóa
                </label>
                <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-(--color-primary) transition-colors">
                  <HiLocationMarker className="text-(--color-primary) w-5 h-5 shrink-0" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Nhập tên khu vực, loại nhà, mức giá..."
                    className="flex-1 w-full outline-none  text-sm font-medium placeholder-gray-400 bg-transparent transition-colors"
                    aria-label="Tìm theo địa điểm, loại nhà, giá"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-[#083344] mb-2">
                  Loại bất động sản
                </label>
                <select
                  value={ptype}
                  onChange={(e) => setPtype(e.target.value as any)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:border-(--color-primary) outline-none transition-colors"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="apartment">🏠 Căn hộ</option>
                  <option value="land">🏞️ Đất nền</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full btn-primary py-3 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <HiSearch className="w-5 h-5" />
                  <span>Tìm kiếm ngay</span>
                </button>
              </div>
            </div>

            {/* Quick Search Tags */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-muted">Tìm kiếm phổ biến:</span>
              {[
                "Đất vườn",
                "Nhà vùng ven",
                "Biệt thự sân vườn",
                "Đất thổ cư",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQ(tag)}
                  className="text-xs px-3 py-1 bg-(--color-pastel) text-(--color-primary) rounded-full hover:bg-(--color-primary) hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
