import type { Metadata } from 'next';
import './globals.css';
import { MadrasahProvider } from '@/context/MadrasahContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা | দুপচাঁচিয়া, বগুড়া',
  description: 'পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা (EIIN: ১৩৪৮৯২, কোড: ১৮৪৫২), দুপচাঁচিয়া, বগুড়া - দ্বীনি ও আধুনিক শিক্ষার এক অনন্য সমন্বয়। অনলাইন ভর্তি আবেদন, পরীক্ষার ফলাফল, নোটিশ বোর্ড ও শিক্ষক তালিকা।',
  keywords: [
    'পশ্চিম আলোহালী ইসলামিয়া আদর্শ বহুমুখী দাখিল মাদ্রাসা',
    'পশ্চিম আলোহালী দাখিল মাদ্রাসা',
    'দুপচাঁচিয়া বগুড়া মাদ্রাসা',
    'Poschim Alohali Islamia Adarsho Bohumukhi Dakhil Madrasah',
    'Dupchanchia Bogura Madrasah',
    'মাদ্রাসা শিক্ষা বোর্ড',
    'অনলাইন ভর্তি মাদ্রাসা',
    'দাখিল ফলাফল',
    'হিফজুল কুরআন',
    'নূরানী মাদ্রাসা'
  ],
  icons: {
    icon: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-[#006837] selection:text-white">
        <MadrasahProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </MadrasahProvider>
      </body>
    </html>
  );
}
