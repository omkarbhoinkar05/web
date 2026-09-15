import React from "react";

export function TrustBar() {
  return (
    <div className="w-full pt-10 pb-8 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-bold tracking-[0.22em] text-zinc-400 uppercase mb-7">
          TRUSTED BY INNOVATIVE BRANDS
        </p>
        <div className="flex flex-wrap items-center gap-8 sm:gap-12 lg:gap-14 opacity-90">
          {/* Google */}
          <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-lg tracking-tight">
            <span className="text-xl font-bold font-sans">Google</span>
          </div>

          {/* Microsoft */}
          <div className="flex items-center gap-2 text-zinc-800 font-bold text-base">
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-[#f25022] w-1.5 h-1.5" />
              <div className="bg-[#7fba00] w-1.5 h-1.5" />
              <div className="bg-[#00a4ef] w-1.5 h-1.5" />
              <div className="bg-[#ffb900] w-1.5 h-1.5" />
            </div>
            <span className="text-base font-semibold text-zinc-800">Microsoft</span>
          </div>

          {/* Spotify */}
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-base">
            <div className="w-5 h-5 rounded-full bg-zinc-950 flex items-center justify-center text-white">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.792-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.077-.502 9.72 1.113.295.18.388.563.208.857zm1.226-2.723c-.226.367-.707.482-1.074.256-2.687-1.652-6.785-2.131-9.965-1.166-.413.126-.85-.108-.975-.521-.125-.414.108-.85.521-.975 3.635-1.103 8.147-.568 11.237 1.332.367.226.482.707.256 1.074zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.13-1.168-.624-.15-.494.13-1.017.624-1.167 3.532-1.072 9.404-.866 13.115 1.337.445.264.59.838.326 1.282-.264.444-.838.59-1.282.327z" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-950">Spotify</span>
          </div>

          {/* Notion */}
          <div className="flex items-center gap-2 text-zinc-950 font-bold text-base">
            <div className="w-5 h-5 rounded-sm border-2 border-zinc-950 flex items-center justify-center font-black text-xs">
              N
            </div>
            <span className="text-base font-bold text-zinc-950">Notion</span>
          </div>

          {/* Slack */}
          <div className="flex items-center gap-2 text-zinc-950 font-bold text-base">
            <svg className="w-5 h-5" viewBox="0 0 127 127" fill="none">
              <path d="M27.2 79.9c0 7.3-5.9 13.2-13.2 13.2C6.7 93.1.8 87.2.8 79.9c0-7.3 5.9-13.2 13.2-13.2h13.2v13.2zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V79.9z" fill="#E01E5A"/>
              <path d="M47 27.2c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.7 39.7.8 47 .8c7.3 0 13.2 5.9 13.2 13.2v13.2H47zm0 6.6c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H14C6.7 60.2.8 54.3.8 47c0-7.3 5.9-13.2 13.2-13.2H47z" fill="#36C5F0"/>
              <path d="M99.7 47c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.7V47zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V14c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2V47z" fill="#2EB67D"/>
              <path d="M79.9 99.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.7h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H79.9z" fill="#ECB22E"/>
            </svg>
            <span className="text-base font-black text-zinc-950">Slack</span>
          </div>

          {/* Figma */}
          <div className="flex items-center gap-2 text-zinc-950 font-bold text-base">
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 rounded-l-full bg-[#F24E1E]" />
                <div className="w-1.5 h-1.5 rounded-r-full bg-[#FF7262]" />
              </div>
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 rounded-l-full bg-[#A259FF]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#1ABCFE]" />
              </div>
              <div className="w-1.5 h-1.5 rounded-l-full bg-[#0ACF83]" />
            </div>
            <span className="text-base font-bold text-zinc-950">Figma</span>
          </div>
        </div>
      </div>
    </div>
  );
}
