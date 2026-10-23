'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { GalleryItem, VideoItem, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/data';
import { useMadrasah } from '@/context/MadrasahContext';
import { Camera, Filter, X, Eye, ImageOff, Play, Film, Calendar, Clock, Video as VideoIcon } from 'lucide-react';

function GalleryContent() {
  const searchParams = useSearchParams();
  const { info, gallery, videos } = useMadrasah();

  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('সকল');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('সকল');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'videos' || tabParam === 'video') {
      setActiveTab('videos');
    }
  }, [searchParams]);

  const photoCategories = ['সকল', 'ক্যাম্পাস', 'অনুষ্ঠান', 'প্রতিযোগিতা', 'ক্লাস', 'সাধারণ'];
  const videoCategories = ['সকল', 'ওয়াজ মাহফিল', 'কুরআন তিলাওয়াত', 'বার্ষিক অনুষ্ঠান', 'বিজ্ঞান মেলা', 'ক্যাম্পাস', 'সাধারণ'];

  const filteredGallery = (gallery || []).filter(item =>
    selectedPhotoCategory === 'সকল' || item.category === selectedPhotoCategory
  );

  const filteredVideos = (videos || []).filter(item =>
    selectedVideoCategory === 'সকল' || item.category === selectedVideoCategory
  );

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
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            স্মৃতি ও মুহূর্ত
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            মাদ্রাসা ফটো ও ভিডিও গ্যালারি
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.nameBn || info.name}-এর বিভিন্ন ধর্মীয় অনুষ্ঠান, ওয়াজ মাহফিল, কুরআন তিলাওয়াত ও ক্যাম্পাসের স্থিরচিত্র ও ভিডিও
          </p>
        </div>

        {/* Top Tab Switcher: Photos vs Videos */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>ফটো গ্যালারি ({gallery?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Film className="w-4 h-4 text-red-400" />
              <span>ভিডিও গ্যালারি ({videos?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* ===================== TAB 1: PHOTOS ===================== */}
        {activeTab === 'photos' && (
          <div>
            {/* Filter Bar */}
            <div className="flex justify-center gap-2 mb-10 flex-wrap">
              {photoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPhotoCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    selectedPhotoCategory === cat
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {filteredGallery.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <ImageOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">এই বিভাগে কোন ছবি পাওয়া যায়নি</h3>
                <p className="text-slate-500 text-xs mt-1">অন্য ক্যাটাগরি নির্বাচন করুন বা পরবর্তীতে আবার দেখুন।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActivePhoto(item)}
                    className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 cursor-pointer bg-slate-950 transition-all duration-300"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        unoptimized={item.imageUrl.startsWith('data:')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold bg-[#DDAA00] text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-300 font-mono">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-base leading-snug group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: VIDEOS ===================== */}
        {activeTab === 'videos' && (
          <div>
            {/* Filter Bar */}
            <div className="flex justify-center gap-2 mb-10 flex-wrap">
              {videoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedVideoCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                    selectedVideoCategory === cat
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Videos Grid */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">এই বিভাগে কোন ভিডিও পাওয়া যায়নি</h3>
                <p className="text-slate-500 text-xs mt-1">অন্য ক্যাটাগরি নির্বাচন করুন বা পরবর্তীতে আবার দেখুন।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => {
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

                        {/* Centered Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-110 transition-all duration-300">
                            <Play className="w-6 h-6 fill-white ml-1" />
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold bg-[#DDAA00] text-slate-900 px-2.5 py-1 rounded-full shadow-sm uppercase">
                            {video.category}
                          </span>
                        </div>

                        {/* Duration Pill */}
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
            )}
          </div>
        )}
      </div>

      {/* Photo Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-[65vh] w-full bg-black">
              <Image
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fill
                className="object-contain"
                unoptimized={activePhoto.imageUrl.startsWith('data:')}
              />
            </div>

            <div className="p-5 bg-slate-950 text-white flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-0.5">
                  ক্যাটাগরি: {activePhoto.category} • {activePhoto.date}
                </span>
                <h3 className="text-lg font-bold">{activePhoto.title}</h3>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Lightbox Player Modal */}
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
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">গ্যালারি লোড হচ্ছে...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
