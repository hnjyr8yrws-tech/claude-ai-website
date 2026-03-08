/**
 * Events.tsx — Latest Events with Countdown Timers
 * shadcn Card + Badge + Button · live countdown · submit CTA
 */

import React, { FC, useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, User } from 'lucide-react';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ─── Types ─────────────────────────────────────────────────────────────────────

type EventType = 'Webinar' | 'Conference' | 'Workshop' | 'Online Course';
type EventBadgeVariant = 'blue' | 'purple' | 'green' | 'orange';

interface EventItem {
  id: string;
  title: string;
  date: Date;
  type: EventType;
  badgeVariant: EventBadgeVariant;
  host: string;
  location: string;
  free: boolean;
  accentColor: string;
  description: string;
}

const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'AI in the Classroom: Getting Started Safely',
    date: new Date('2026-04-08T14:00:00'),
    type: 'Webinar',
    badgeVariant: 'blue',
    host: 'Promptly Editorial Team',
    location: 'Online — Zoom',
    free: true,
    accentColor: '#3B82F6',
    description: 'A practical 60-minute introduction to using AI tools safely in KS2 and KS3 classrooms. Live Q&A included.',
  },
  {
    id: 'e2',
    title: 'EdTech & AI Summit — London 2026',
    date: new Date('2026-04-22T09:00:00'),
    type: 'Conference',
    badgeVariant: 'purple',
    host: 'BETT Alumni Network',
    location: 'ExCeL London',
    free: false,
    accentColor: '#8B5CF6',
    description: 'Two-day conference covering AI governance, EdTech procurement, and classroom implementation across all key stages.',
  },
  {
    id: 'e3',
    title: 'Marking Smarter with AI — Practical Workshop',
    date: new Date('2026-05-03T10:00:00'),
    type: 'Workshop',
    badgeVariant: 'green',
    host: 'Teacher Toolkit',
    location: 'Online — Google Meet',
    free: true,
    accentColor: '#22C55E',
    description: 'Hands-on workshop: use AI to generate formative feedback faster without losing the human touch. Limited to 40 attendees.',
  },
  {
    id: 'e4',
    title: 'GDPR & AI Tools for Schools — Compliance Course',
    date: new Date('2026-05-19T13:00:00'),
    type: 'Online Course',
    badgeVariant: 'orange',
    host: 'DPO Centre UK',
    location: 'Self-paced — Online',
    free: false,
    accentColor: '#F97316',
    description: 'Understand your school\'s data obligations when deploying AI tools. CPD-accredited. Certificate on completion.',
  },
];

// ─── Countdown ─────────────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
      past: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const CountdownUnit: FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
  <div className="flex flex-col items-center">
    <motion.span
      key={value}
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="text-xl font-black tabular-nums leading-none"
      style={{ color }}
    >
      {String(value).padStart(2, '0')}
    </motion.span>
    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{label}</span>
  </div>
);

const Countdown: FC<{ date: Date; color: string }> = ({ date, color }) => {
  const { days, hours, minutes, seconds, past } = useCountdown(date);
  if (past) return <span className="text-xs font-bold text-gray-400">Event has passed</span>;
  return (
    <div className="flex items-end gap-3">
      <CountdownUnit value={days}    label="Days" color={color} />
      <span className="text-gray-300 font-black text-lg mb-1">:</span>
      <CountdownUnit value={hours}   label="Hrs"  color={color} />
      <span className="text-gray-300 font-black text-lg mb-1">:</span>
      <CountdownUnit value={minutes} label="Min"  color={color} />
      <span className="text-gray-300 font-black text-lg mb-1">:</span>
      <CountdownUnit value={seconds} label="Sec"  color={color} />
    </div>
  );
};

// ─── Event card ────────────────────────────────────────────────────────────────

const EventCard: FC<{ event: EventItem }> = ({ event }) => (
  <motion.div variants={cardVariants} whileHover={{ y: -5 }}>
    <Card className="h-full rounded-2xl border-0 overflow-hidden p-0">
      <div className="h-1.5 w-full" style={{ backgroundColor: event.accentColor }} />
      <CardContent className="p-5 flex flex-col gap-4 h-full">

        {/* Type + free */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={event.badgeVariant} className="rounded-full">{event.type}</Badge>
          {event.free && <Badge variant="green" className="rounded-full">FREE</Badge>}
        </div>

        <h3 className="text-sm font-black text-ink leading-snug">{event.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">{event.description}</p>

        {/* Meta */}
        <div className="space-y-1.5 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {event.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}
            {event.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {event.location}
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {event.host}
          </div>
        </div>

        {/* Countdown */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Starts in</div>
          <Countdown date={event.date} color={event.accentColor} />
        </div>

        {/* Register */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button
            className="w-full rounded-xl text-white"
            style={{ backgroundColor: event.accentColor } as React.CSSProperties}
          >
            Register Now →
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);

// ─── Main component ────────────────────────────────────────────────────────────

const Events: FC = () => (
  <section id="events" aria-labelledby="events-heading" className="bg-cream-warm py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="purple" className="text-[10px] tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full">
          Upcoming Events
        </Badge>
        <h2 id="events-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight mt-3">
          Learn, Connect &<br />
          <span className="text-brand-purple">Stay Current</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto text-sm">
          Webinars, conferences, and workshops to keep your school at the forefront of safe AI in education.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </motion.div>

      {/* Submit CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Card className="mt-12 rounded-2xl border-0 text-center p-0">
          <CardContent className="p-8 sm:p-10">
            <div className="text-2xl font-black text-ink mb-2">Running an EdTech event?</div>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Get it in front of 12,000+ UK educators. Listing is free for non-commercial events.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button variant="purple" size="lg" className="rounded-xl">
                  Post Your Event →
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                >
                  View All Events
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </section>
);

export default Events;
