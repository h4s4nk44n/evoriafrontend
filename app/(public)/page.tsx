'use client';

import { useState, type ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, Input, Progress, GradientCover, cx } from '../../components/ui';
import {
  IconSearch, IconCalendar, IconMapPin, IconTicket, IconHeart, IconArrowRight,
  IconCheck, IconFlame, IconChevronLeft, IconChevronRight, IconSliders,
  IconSparkles, IconMusic, IconMic, IconTrophy, IconDrama,
  type IconProps,
} from '../../components/icons';
import { CATEGORIES, EVENTS } from '../../data/events';
import type { Event as EventType, CategoryId } from '../../types';
import { fmtDate, fmtTime } from '../../lib/utils';

const iconMap: Record<string, ComponentType<Omit<IconProps, 'children'>>> = {
  IconSparkles, IconMusic, IconFlame, IconMic, IconTrophy, IconDrama,
};

const HomeHero = ({ event, onOpen }: { event: EventType; onOpen: (id: string) => void }) => (
  <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
    <GradientCover cat={event.category} className="absolute inset-0" />
    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/70 via-slate-900/30 to-transparent" />
    <div className="relative px-8 md:px-14 py-12 md:py-16 text-white lg:pr-[320px]">
      <div className="flex items-center gap-2 text-xs tracking-[0.2em] font-mono font-semibold opacity-90 mb-6">
        <span className="inline-block w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
        FEATURED · {event.city.toUpperCase()}
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-xl lg:max-w-[520px] tracking-tight">
        {event.title}
      </h1>
      <p className="mt-4 text-lg md:text-xl max-w-md text-white/85">{event.tagline}</p>
      <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/85">
        <span className="inline-flex items-center gap-2"><IconCalendar size={16} />{fmtDate(event.date)}</span>
        <span className="inline-flex items-center gap-2"><IconMapPin size={16} />{event.venue}</span>
        <span className="inline-flex items-center gap-2"><IconTicket size={16} />From ${event.priceFrom}</span>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <Button variant="accent" size="lg" rightIcon={<IconArrowRight size={18} />} onClick={() => onOpen(event.id)}>
          Open event
        </Button>
        <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 dark:bg-white/10 dark:border-white/20">
          <IconHeart size={16} /> Save
        </Button>
      </div>
    </div>
    <div className="hidden lg:block absolute right-8 top-8 bottom-8 w-64">
      <div className="h-full rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-5 text-white">
        <div className="text-[11px] tracking-[0.18em] font-mono font-semibold opacity-80">LIVE · DEMAND</div>
        <div className="mt-2 text-4xl font-bold tabular-nums">{event.sold.toLocaleString()}</div>
        <div className="text-xs opacity-80">tickets sold of {event.capacity.toLocaleString()}</div>
        <Progress value={(event.sold / event.capacity) * 100} className="mt-4 bg-white/20" barClassName="bg-accent-500" />
        <div className="mt-6 space-y-2 text-xs">
          {event.highlights.slice(0, 3).map((h, i) => (
            <div key={i} className="flex items-start gap-2"><IconCheck size={14} className="mt-0.5 shrink-0" /><span>{h}</span></div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const SearchStrip = ({
  query, setQuery, dateRange, setDateRange, venue, setVenue,
}: {
  query: string; setQuery: (v: string) => void;
  dateRange: string; setDateRange: (v: string) => void;
  venue: string; setVenue: (v: string) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px_auto] gap-3 p-2 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
    <Input leftIcon={<IconSearch size={18} />} placeholder="Search events, artists, venues…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-12" />
    <Input leftIcon={<IconCalendar size={18} />} placeholder="Any date" value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="h-12" />
    <Input leftIcon={<IconMapPin size={18} />} placeholder="Any city" value={venue} onChange={(e) => setVenue(e.target.value)} className="h-12" />
    <Button size="lg" className="h-12 px-6" leftIcon={<IconSearch size={16} />}>Search</Button>
  </div>
);

const CategoryPills = ({ active, setActive }: { active: CategoryId; setActive: (c: CategoryId) => void }) => (
  <div className="flex flex-wrap items-center gap-2">
    {CATEGORIES.map((c) => {
      const Ico = iconMap[c.icon];
      const on = active === c.id;
      return (
        <button
          key={c.id}
          onClick={() => setActive(c.id)}
          className={cx(
            'inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium border transition-colors',
            on
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-600',
          )}
        >
          {Ico && <Ico size={15} />}{c.label}
        </button>
      );
    })}
  </div>
);

const EventCard = ({ event, onOpen }: { event: EventType; onOpen: (id: string) => void }) => {
  const pct = (event.sold / event.capacity) * 100;
  const heatTone: 'danger' | 'warn' | 'success' =
    event.heat === 'Almost Sold Out' ? 'danger' : event.heat === 'Selling Fast' ? 'warn' : 'success';
  const cat = CATEGORIES.find((c) => c.id === event.category);
  return (
    <article className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-slate-300 hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700">
      <GradientCover cat={event.category} className="aspect-[4/3]" label={cat?.label}>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <Badge tone={heatTone} className="bg-white/95 text-slate-900 border-0 dark:bg-white/95 dark:text-slate-900">
            {event.heat === 'Almost Sold Out' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
            {event.heat === 'Selling Fast' && <IconFlame size={11} />}
            {event.heat}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="text-white font-mono text-[11px] tracking-[0.18em] font-semibold">
            {fmtDate(event.date).toUpperCase()} · {fmtTime(event.date)}
          </div>
        </div>
      </GradientCover>
      <div className="p-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{event.venue} · {event.city}</div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">{event.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">From</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">${event.priceFrom}</div>
          </div>
          <Button size="sm" variant="outline" onClick={() => onOpen(event.id)} rightIcon={<IconArrowRight size={14} />}>
            Details
          </Button>
        </div>
        <div className="mt-3">
          <Progress value={pct} barClassName={pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-accent-500' : 'bg-brand-500'} />
          <div className="mt-1.5 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            <span>{Math.round(pct)}% sold</span>
            <span>{(event.capacity - event.sold).toLocaleString()} seats left</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [venue, setVenue] = useState('');
  const [cat, setCat] = useState<CategoryId>('all');

  const featured = EVENTS[0];
  const list = EVENTS.filter((e) => {
    if (cat !== 'all' && e.category !== cat) return false;
    if (query && !(e.title + ' ' + e.artist + ' ' + e.venue + ' ' + e.city).toLowerCase().includes(query.toLowerCase())) return false;
    if (venue && !(e.venue + ' ' + e.city).toLowerCase().includes(venue.toLowerCase())) return false;
    return true;
  });

  const openEvent = (id: string) => router.push(`/events/${id}`);

  return (
    <div className="page-enter mx-auto max-w-7xl px-6 md:px-10 py-8 space-y-10">
      <HomeHero event={featured} onOpen={openEvent} />
      <div className="space-y-5">
        <SearchStrip query={query} setQuery={setQuery} dateRange={dateRange} setDateRange={setDateRange} venue={venue} setVenue={setVenue} />
        <CategoryPills active={cat} setActive={setCat} />
      </div>
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              This week in {venue || 'your region'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{list.length} events · sorted by demand</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <IconSliders size={14} /> Sorted by <span className="font-medium text-slate-700 dark:text-slate-200">Most popular</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((e) => <EventCard key={e.id} event={e} onOpen={openEvent} />)}
        </div>
        <div className="mt-8 flex items-center justify-center gap-1 text-sm">
          <Button variant="ghost" size="sm" leftIcon={<IconChevronLeft size={14} />}>Prev</Button>
          {[1, 2, 3, 4, 5].map((n, i) => (
            <button key={n} className={cx('h-8 w-8 rounded-md text-sm font-medium',
              i === 0 ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            )}>{n}</button>
          ))}
          <span className="text-slate-400 px-2">…</span>
          <Button variant="ghost" size="sm" rightIcon={<IconChevronRight size={14} />}>Next</Button>
        </div>
      </section>
    </div>
  );
}
