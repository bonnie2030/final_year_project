import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, Copy, UserCheck } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Drivers() {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/drivers/public');
      const data = await res.json();
      if (res.ok) setDrivers(data.drivers || []);
      else toast({ title: 'Failed to load drivers', description: data.message || 'Error' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err || 'Error');
      toast({ title: 'Failed to load drivers', description: message || 'Error', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const filtered = drivers.filter((d) => {
    const name = String((d as any).name || '').toLowerCase();
    const email = String((d as any).email || '').toLowerCase();
    const phone = String((d as any).phone || '').toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return name.includes(q) || email.includes(q) || phone.includes(q) || String((d as any).username || '').toLowerCase().includes(q);
  });

  const handleCopy = (text?: string) => {
    if (!text) return; try { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); } catch (e) { toast({ title: 'Copy failed' }); }
  };

  const resolveImageUrl = (value?: string | null) => {
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) {
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && value.startsWith('http://')) {
        return '';
      }
      return value;
    }
    const normalized = value.startsWith('/') ? value : `/${value}`;
    if (normalized.startsWith('/uploads/')) return normalized;
    return `${API_BASE}${normalized}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Drivers - MatatuConnect</title>
      </Helmet>
      <Header />
      <main className="container py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold">Drivers</h1>
            <p className="text-sm text-muted-foreground">This list shows registered drivers. Contact admin for access.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto sm:max-w-xs">
            <Input className="min-w-0" placeholder="Search by name, email or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button variant="outline" onClick={() => setQuery('')}>Clear</Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.length === 0 && <div className="text-sm text-muted-foreground">No drivers found.</div>}
            {filtered.map((d) => {
              const driver = d as any;
              const initials = (driver.name || 'D').split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase();

              return (
                <div key={driver.id} className="p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex items-start gap-3">
                    <Avatar className="shrink-0">
                      <AvatarImage src={resolveImageUrl(driver.profile_image)} alt={driver.name || driver.username || 'Driver'} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {/* Name row */}
                      <div className="font-medium text-base leading-tight truncate">
                        {driver.name}{' '}
                        <span className="text-sm text-muted-foreground font-normal">({driver.username})</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5 truncate">{driver.email}</div>
                      <div className="text-sm text-muted-foreground">{driver.phone}</div>
                      {/* Vehicle below name — no longer floating right */}
                      <div className="text-xs text-muted-foreground mt-1">
                        Vehicle: <span className="font-medium text-foreground">{driver.vehicle_reg || 'Not assigned'}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {driver.phone && (
                          <a href={`tel:${driver.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm shrink-0">
                            <Phone className="size-4" /> Call
                          </a>
                        )}

                        {driver.phone && (
                          <Button variant="outline" size="sm" className="shrink-0" onClick={() => handleCopy(driver.phone)}>
                            <Copy className="size-4 mr-1.5" /> Copy
                          </Button>
                        )}

                        <Button variant="ghost" size="sm" className="shrink-0" onClick={() => handleCopy(driver.email)}>
                          <UserCheck className="size-4 mr-1.5" /> Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
