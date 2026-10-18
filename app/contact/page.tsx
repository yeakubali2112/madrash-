'use client';

import React, { useState } from 'react';
import { useMadrasah } from '@/context/MadrasahContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  School,
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const { info, submitContactMessage } = useMadrasah();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('দয়া করে আপনার নাম, মোবাইল নম্বর এবং বার্তাটি লিখুন।');
      return;
    }

    submitContactMessage(formData);
    setIsSent(true);
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-2">
            সরাসরি যোগাযোগ
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            যোগাযোগ ও অনুসন্ধান
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            {info.name}-এর প্রশাসন বা শিক্ষকদের সাথে যেকোনো বিষয়ে তথ্য বা সহায়তার জন্য যোগাযোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-amber-300 border-b border-emerald-800 pb-3 flex items-center gap-2">
                <School className="w-5 h-5" />
                <span>মাদ্রাসা অফিস ও হেল্পলাইন</span>
              </h2>

              <div className="space-y-4 text-xs md:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">ঠিকানা:</strong>
                    <span className="text-emerald-200">{info.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">মোবাইল হেল্পলাইন:</strong>
                    <a href={`tel:${info.phone}`} className="text-emerald-200 block hover:text-amber-300 font-mono">{info.phone}</a>
                    <a href={`tel:${info.altPhone}`} className="text-emerald-200 block hover:text-amber-300 font-mono">{info.altPhone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">ইমেইল ঠিকানা:</strong>
                    <a href={`mailto:${info.email}`} className="text-emerald-200 hover:text-amber-300 break-all">{info.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">অফিস সময়সূচি:</strong>
                    <span className="text-emerald-200">{info.officeHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-800/80 text-xs text-emerald-300/80">
                <p>EIIN: {info.eiin} • মাদ্রাসা কোড: {info.madrasahCode}</p>
                <p className="mt-1">বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড অনুমোদিত এমপিওভুক্ত প্রতিষ্ঠান।</p>
              </div>
            </div>
          </div>

          {/* Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <span>আমাদের বার্তা পাঠান</span>
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                ভর্তি তথ্য, অভিযোগ বা যেকোনো মতামতের জন্য নিচের ফরমটি পূরণ করুন। আমাদের অফিসিয়াল প্রতিনিধি অতিদ্রুত আপনার সাথে যোগাযোগ করবেন।
              </p>

              {isSent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!</h3>
                  <p className="text-xs text-emerald-800">
                    ধন্যবাদ। আমাদের দায়িত্বশীল শিক্ষক বা কর্মকর্তা আপনার মোবাইল নম্বরে দ্রুত যোগাযোগ করবেন।
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="inline-block bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="আপনার নাম"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        সচল মোবাইল নম্বর <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ইমেইল (ঐচ্ছিক)
                      </label>
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        বার্তার বিষয়
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: ভর্তি তথ্য / হোস্টেল খরচ"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      আপনার বার্তা বা বক্তব্য <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="বিস্তারিত লিখুন..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs md:text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-xs md:text-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>বার্তা পাঠান</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
