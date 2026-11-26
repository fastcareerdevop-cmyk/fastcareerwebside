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
  // Simplified card data – keep only essential info
  const cards = [
    {
      name: 'Sarthak Jain',
      title: 'Founder, Director & Executive Head',
      img: '/sarthak_jain.jpg',
      phone: '+91 98260 23534',
      email: 'esarthak@gmail.com',
      website: 'https://sarthakjainca.com/',
    },
    {
      name: 'Ritesh Gupta',
      title: 'Founder, Director & Corporate Head',
      img: '/ritesh_gupta_new.jpg?v=2',
      phone: '+91 92291 13040',
      email: 'linkritesh@gmail.com',
      website: 'https://fast-india.com',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={animate ? { opacity: 0, y: 20 } : undefined}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="relative min-h-[230px] sm:min-h-[210px] rounded-xl bg-white border border-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.10)] overflow-hidden"
        >
          <div className="grid grid-cols-[92px_1fr] sm:grid-cols-[118px_1fr] h-full min-h-[210px]">
            <div
              className="bg-slate-100 bg-cover bg-center"
              style={{ backgroundImage: `url(${c.img})`, backgroundPosition: i === 0 ? 'center 20%' : 'center 18%' }}
            />
            <div className="flex min-w-0 flex-col px-4 sm:px-5 pt-5 pb-4">
              <div className="pr-9">
                <h3 className="text-[17px] sm:text-lg font-extrabold text-slate-950 leading-tight">{c.name}</h3>
                <p className="mt-1 text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em] leading-relaxed">
                  {c.title}
                </p>
              </div>

              <a
                href={`tel:${c.phone.replace(/\s/g, '')}`}
                title={`Call ${c.name}`}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-sky-50 text-[#2563EB] flex items-center justify-center hover:bg-[#2563EB] hover:text-white transition-colors"
              >
                <Phone size={15} />
              </a>

              <div className="mt-5 space-y-2 text-[11px] sm:text-xs text-slate-700">
                <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 min-w-0 hover:text-[#2563EB] transition-colors">
                  <Phone size={13} className="shrink-0 text-[#2563EB]" />
                  <span>{c.phone}</span>
                </a>
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 min-w-0 hover:text-[#2563EB] transition-colors">
                  <Mail size={13} className="shrink-0 text-[#2563EB]" />
                  <span className="truncate">{c.email}</span>
                </a>
                <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 min-w-0 hover:text-[#2563EB] transition-colors">
                  <Globe size={13} className="shrink-0 text-[#2563EB]" />
                  <span className="truncate">{c.website.replace(/^https?:\/\//, '')}</span>
                </a>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[11px] font-bold text-[#2563EB]">
                  <Building2 size={13} className="shrink-0" />
                  {i === 0 ? 'Executive Consultations' : 'Corporate Recruitments'}
                </span>
                <a
                  href={`https://wa.me/${i === 0 ? '919826023534' : '919229113040'}?text=Hello`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 text-[10px] sm:text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle size={13} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
