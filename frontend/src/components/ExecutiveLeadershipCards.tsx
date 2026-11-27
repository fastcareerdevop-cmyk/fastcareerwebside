import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Globe, Building2, MessageCircle } from 'lucide-react';

interface ExecutiveLeadershipCardsProps {
  className?: string;
  animate?: boolean;
}

export const ExecutiveLeadershipCards: React.FC<ExecutiveLeadershipCardsProps> = ({
  className = '',
  animate = true,
}) => {
  const cards = [
    {
      name: 'Sarthak Jain',
      title: 'Founder, Director & Executive Head',
      img: '/sarthak_jain.jpg',
      phone: '+91 98260 23534',
      email: 'esarthak@gmail.com',
      website: 'https://sarthakjainca.com/',
      whatsapp: '919826023534',
      dept: 'Executive Consultations',
    },
    {
      name: 'Ritesh Gupta',
      title: 'Founder, Director & Corporate Head',
      img: '/ritesh_gupta_new.jpg?v=2',
      phone: '+91 92291 13040',
      email: 'linkritesh@gmail.com',
      website: 'https://fast-india.com',
      whatsapp: '919229113040',
      dept: 'Corporate Recruitments',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${className}`}>
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={animate ? { opacity: 0, y: 20 } : undefined}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="relative rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.10)] overflow-hidden"
        >
          {/* Top banner bar */}
          <div className="h-20 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 relative">
            {/* Phone icon button on top-right */}
            <a
              href={`tel:${c.phone.replace(/\s/g, '')}`}
              title={`Call ${c.name}`}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#2563EB] transition-colors"
            >
              <Phone size={16} />
            </a>
          </div>

          {/* Profile photo - overlapping the banner */}
          <div className="flex justify-center -mt-12 relative z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card content */}
          <div className="px-5 sm:px-6 pt-3 pb-5 text-center">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 leading-tight">{c.name}</h3>
            <p className="mt-1 text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em]">
              {c.title}
            </p>

            {/* Contact details */}
            <div className="mt-4 space-y-2 text-[11px] sm:text-xs text-slate-700 text-left max-w-[260px] mx-auto">
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 hover:text-[#2563EB] transition-colors">
                <Phone size={14} className="shrink-0 text-[#2563EB]" />
                <span className="font-medium">{c.phone}</span>
              </a>
              <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 hover:text-[#2563EB] transition-colors">
                <Mail size={14} className="shrink-0 text-[#2563EB]" />
                <span className="truncate font-medium">{c.email}</span>
              </a>
              <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#2563EB] transition-colors">
                <Globe size={14} className="shrink-0 text-[#2563EB]" />
                <span className="truncate font-medium">{c.website.replace(/^https?:\/\//, '')}</span>
              </a>
            </div>

            {/* Footer: Department + WhatsApp */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#2563EB]">
                <Building2 size={14} className="shrink-0" />
                {c.dept}
              </span>
              <a
                href={`https://wa.me/${c.whatsapp}?text=Hello`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
