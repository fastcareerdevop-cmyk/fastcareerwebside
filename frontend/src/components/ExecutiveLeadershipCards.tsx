import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Globe } from 'lucide-react';

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
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={animate ? { opacity: 0, y: 20 } : undefined}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
          style={{ backgroundImage: `url(${c.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* dark overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-lg font-bold text-white mb-1 tracking-wide">{c.name}</h3>
            <p className="text-sm text-gray-200 uppercase tracking-wider mb-2">{c.title}</p>
            <div className="flex flex-col space-y-1 text-xs text-gray-100 w-full">
              <a href={`tel:${c.phone}`} className="flex items-center justify-center gap-1 hover:text-gray-300 transition-colors">
                <Phone size={14} className="text-gray-100" /> {c.phone}
              </a>
              <a href={`mailto:${c.email}`} className="flex items-center justify-center gap-1 hover:text-gray-300 transition-colors">
                <Mail size={14} className="text-gray-100" /> {c.email}
              </a>
              <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 hover:text-gray-300 transition-colors">
                <Globe size={14} className="text-gray-100" /> Website
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
