'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cx } from '../../../lib/utils';
import { IconTicket, IconCalendar, IconInfo } from '../../../components/icons';
import { useAuth } from '../../../state/auth';
import type { Role } from '../../../types';

type RegRole = Extract<Role, 'attendee' | 'organizer'>;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<RegRole>('attendee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    register({
      role,
      name: name || (role === 'organizer' ? 'New Organizer' : 'New Attendee'),
      email: email || (role === 'organizer' ? 'new@organizer.co' : 'new@attendee.co'),
    });
    router.replace('/');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center py-10 px-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900">Create your account</h1>
          <p className="text-[13.5px] text-slate-500 mt-1.5">One account unlocks bookings and (optionally) event management.</p>
        </div>
        <form onSubmit={submit} className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label className="block text-[12px] font-medium text-slate-700 mb-2">I&apos;m signing up as</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'attendee',  label: 'Attendee',  desc: 'Book tickets, manage your bookings.',   Icon: IconTicket },
                { id: 'organizer', label: 'Organizer', desc: 'Publish events, track sales & revenue.', Icon: IconCalendar },
              ].map((r) => {
                const on = role === r.id;
                const I = r.Icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as RegRole)}
                    className={cx(
                      'p-3 rounded-lg border text-left transition-colors',
                      on ? 'border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/10' : 'border-slate-200 bg-white hover:bg-slate-50',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cx('w-7 h-7 rounded-md grid place-items-center', on ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500')}>
                        <I size={14} />
                      </div>
                      <div className="text-[13px] font-semibold text-slate-900">{r.label}</div>
                    </div>
                    <div className="text-[11.5px] text-slate-500 mt-1.5 leading-snug">{r.desc}</div>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500">
              <IconInfo size={12} className="text-slate-400 mt-0.5" />
              Admin accounts are provisioned by the seed script and can&apos;t be self-registered.
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'organizer' ? 'e.g. Lumen Collective' : 'e.g. Selin Demir'}
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[13.5px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[13.5px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 10 characters"
                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[13.5px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <label className="flex items-start gap-2 text-[12px] text-slate-600 pt-1">
              <input type="checkbox" className="mt-0.5 rounded border-slate-300" />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
          </div>
          <button type="submit" className="mt-4 w-full h-10 rounded-md bg-slate-900 text-white text-[13.5px] font-medium hover:bg-slate-800">
            Create {role === 'organizer' ? 'Organizer' : 'Attendee'} account
          </button>
          <div className="mt-4 text-center text-[12.5px] text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
