
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsletterSection {
  type: 'intro' | 'heading' | 'text' | 'list' | 'signature';
  content?: string;
  items?: string[];
  name?: string;
  title?: string;
  subtitle?: string;
}

interface NewsletterData {
  volume: number;
  title: string;
  date: string;
  author: string;
  authorTitle: string;
  sections: NewsletterSection[];
}

export default function NewsletterContent({ data }: { data: NewsletterData }) {
  return (
    <article className="bg-white min-h-screen pt-32 pb-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-8">
        <Link href="/newsletter">
          <Button variant="outline" className="group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Newsletter Archive
          </Button>
        </Link>
      </div>

      {/* Newsletter Header */}
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 pb-8 border-b-2 border-[#C8B273]"
        >
          {/* Volume Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C8B273] text-black rounded-full px-4 py-2 mb-6 font-bold text-sm">
            <Mail className="w-4 h-4" />
            <span>VOLUME {data.volume}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 font-audiowide uppercase leading-tight">
            {data.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C8B273]" />
              <span>{data.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#C8B273]" />
              <span>{data.author} - {data.authorTitle}</span>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {data.sections.map((section, index) => {
            switch (section.type) {
              case 'intro':
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-[#C8B273] p-6 rounded-r-lg mb-8"
                  >
                    <p className="text-xl text-gray-800 leading-relaxed m-0 font-medium">
                      {section.content}
                    </p>
                  </div>
                );

              case 'heading':
                return (
                  <h2
                    key={index}
                    className="text-3xl font-bold text-black mt-12 mb-6 font-audiowide uppercase border-b-2 border-[#C8B273] pb-3"
                  >
                    {section.content}
                  </h2>
                );

              case 'text':
                return (
                  <div key={index} className="mb-6">
                    {section.content?.split('\n\n').map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-gray-800 leading-relaxed mb-4 text-lg"
                        dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black font-bold">$1</strong>') }}
                      />
                    ))}
                  </div>
                );

              case 'list':
                return (
                  <ul key={index} className="space-y-3 mb-8 ml-6">
                    {section.items?.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-gray-800 leading-relaxed text-lg relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:bg-[#C8B273] before:rounded-full"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                );

              case 'signature':
                return (
                  <div
                    key={index}
                    className="mt-16 pt-8 border-t-2 border-gray-200"
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold text-black font-audiowide mb-1">
                        {section.name}
                      </p>
                      <p className="text-lg text-[#C8B273] font-semibold mb-1">
                        {section.title}
                      </p>
                      {section.subtitle && (
                        <p className="text-gray-600 italic">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 bg-gradient-to-br from-[#C8B273] to-[#FFD700] rounded-2xl text-center"
        >
          <h3 className="text-2xl font-bold text-black mb-4 font-audiowide uppercase">
            READY TO ELEVATE YOUR GAME?
          </h3>
          <p className="text-black mb-6 text-lg">
            Explore our programs and start your basketball journey today
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/programs">
              <Button className="bg-black hover:bg-gray-900 text-white font-bold px-8 py-6 text-lg">
                VIEW PROGRAMS
              </Button>
            </Link>
            <Link href="/private-lessons">
              <Button variant="outline" className="border-2 border-black hover:bg-black/10 text-black font-bold px-8 py-6 text-lg">
                BOOK PRIVATE LESSONS
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Back to Archive Link */}
        <div className="text-center mt-12">
          <Link href="/newsletter">
            <Button variant="link" className="text-[#C8B273] hover:text-[#FFD700] text-lg font-semibold">
              ← Back to Newsletter Archive
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
