'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMadrasah } from '@/context/MadrasahContext';
import { VideoItem, defaultVideos, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/data';
import { Play, Film, Calendar, Clock, X, ExternalLink, Video as VideoIcon } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const { videos } = useMadrasah();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const videoList = (videos && videos.length > 0 ? videos : defaultVideos) || [];
  const displayVideos = videoList.slice(0, 3);

  const getEmbedSource = (video: VideoItem) => {
    if (video.videoType === 'youtube' || video.videoUrl.includes('youtu')) {
      return getYouTubeEmbedUrl(video.videoUrl) || video.videoUrl;
    }
    return null;
  };

  const getDisplayThumbnail = (video: VideoItem) => {
    if (video.thumbnailUrl) return video.thumbnailUrl;
    const ytThumb = getYouTubeThumbnail(video.videoUrl);
    if (ytThumb) return ytThumb;
    return 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80';
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-70" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl -z-10 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-red-200">
              <Film className="w-3.5 h-3.5 text-red-600" />
              <span>ভিডিও ও মাল্টিমিডিয়া কর্নার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              মাদ্রাসার কার্যক্রম ও ভিডিও গ্যালারি
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              পশ্চিম আলোহালী মাদ্রাসার বার্ষিক ইসলামী সম্মেলন, পবিত্র কুরআন তিলাওয়াত, ওয়াজ মাহফিল ও বিভিন্ন অনুষ্ঠানের গুরুত্বপূর্ণ ভিডিও চিত্র।
            </p>
          </div>

          <Link
            href="/gallery?tab=videos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-md hover:shadow-lg transition-all group shrink-0"
          >
            <span>সকল ভিডিও দেখুন</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVideos.map((video) => {
            const thumb = getDisplayThumbnail(video);
            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                {/* Thumbnail & Play Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <Image
                    src={thumb}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    unoptimized={thumb.startsWith('data:') || thumb.includes('unsplash') || thumb.includes('youtube')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Pulsing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-110 transition-all duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>

                  {/* Category & Duration Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold bg-[#DDAA00] text-slate-900 px-2.5 py-1 rounded-full shadow-sm uppercase">
                      {video.category}
                    </span>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{video.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-emerald-700" /> ভিডিও প্লে করুন
                    </span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Player Lightbox Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <span className="text-[10px] font-bold bg-[#DDAA00] text-slate-950 px-2 py-0.5 rounded-md uppercase shrink-0">
                  {activeVideo.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              {getEmbedSource(activeVideo) ? (
                <iframe
                  src={getEmbedSource(activeVideo)!}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-full bg-black"
                  src={activeVideo.videoUrl}
                >
                  আপনার ব্রাউজারে ভিডিওটি সমর্থিত নয়।
                </video>
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 sm:p-5 bg-slate-900 text-slate-300 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                <span className="font-mono text-slate-400 text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> প্রকাশের তারিখ: {activeVideo.date}
                </span>
                {activeVideo.duration && (
                  <span className="font-mono text-amber-400 text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> দৈর্ঘ্য: {activeVideo.duration}
                  </span>
                )}
              </div>
              {activeVideo.description && (
                <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">
                  {activeVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
