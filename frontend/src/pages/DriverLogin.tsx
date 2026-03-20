import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { Bus, AlertCircle, ShieldCheck, Clock3, KeyRound, Eye, EyeOff, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const DEMO_USERNAME = 'DRIVE0007';
const DEMO_PASSWORD = 'Driver@Matatu2024!';

export default function DriverLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [sessionInvalidated, setSessionInvalidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if redirected due to session invalidation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reason') === 'SESSION_INVALIDATED') {
      setSessionInvalidated(true);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }
  }, [location]);

  const handleLogin = async () => {
    if (!identifier || !password) return toast({ title: 'Missing fields', description: 'Enter username/email and password', variant: 'destructive' });
    setIsLoading(true);
    try {
      const isDemo = identifier === DEMO_USERNAME;
      const endpoint = isDemo ? '/api/auth/demo_driver_login' : '/api/auth/login';
      const res = await fetch((import.meta.env.VITE_API_URL || '') + endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        if (data.info) {
          toast({ title: 'Info', description: data.info });
        }
        toast({ title: 'Logged in', description: 'Welcome back' });
        navigate('/driver/dashboard');
      } else {
        toast({ title: 'Login failed', description: data.message || 'Invalid credentials', variant: 'destructive' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err || 'Error');
      toast({ title: 'Login failed', description: message || 'Error', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async () => {
    setIdentifier(DEMO_USERNAME);
    setPassword(DEMO_PASSWORD);
    setIsLoading(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/demo_driver_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: DEMO_USERNAME, password: DEMO_PASSWORD })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        toast({ title: 'Welcome!', description: 'Demo driver portal access granted.' });
        navigate('/driver/dashboard');
      } else {
        toast({ title: 'Demo Login Failed', description: data.message || 'Invalid credentials', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Demo Login Failed', description: err.message || 'Error', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const [hasSaved, setHasSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [savedCreds, setSavedCreds] = useState<{ username?: string; password?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lastCreatedDriver');
      if (raw) {
        const creds = JSON.parse(raw);
        setSavedCreds(creds);
        if (creds?.username) setIdentifier(creds.username);
        if (creds?.password) setPassword(creds.password);
        setHasSaved(true);
      }
    } catch (e) {
      console.warn('Unable to parse saved driver credentials', e);
    }
  }, []);

  const useSaved = () => {
    try {
      const raw = localStorage.getItem('lastCreatedDriver');
      if (!raw) return;
      const creds = JSON.parse(raw);
      if (creds.username) setIdentifier(creds.username);
      if (creds.password) setPassword(creds.password);
      setSavedCreds(creds);
      setHasSaved(true);
    } catch (e) {
      console.warn('Unable to load saved credentials', e);
    }
  };

  const quickLogin = async () => {
    try {
      const raw = localStorage.getItem('lastCreatedDriver');
      if (!raw) return;
      const creds = JSON.parse(raw);
      if (!creds.username || !creds.password) return;
      setIdentifier(creds.username);
      setPassword(creds.password);
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: creds.username, password: creds.password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        toast({ title: 'Logged in', description: 'Welcome back' });
        navigate('/driver/dashboard');
      } else {
        toast({ title: 'Login failed', description: data.message || 'Invalid credentials', variant: 'destructive' });
      }
    } catch (e) {
      console.warn('Quick login failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Helmet>
        <title>Driver Login - MatatuConnect</title>
      </Helmet>

      <Header />

      <div className="container max-w-6xl mx-auto py-10 sm:py-14 px-4">
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 items-start">
          <section className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 text-white p-6 sm:p-8 shadow-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm mb-5">
              <Bus className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Driver Portal</h1>
            <p className="mt-3 text-sm sm:text-base text-blue-50/95">
              Sign in to manage location sharing, ride operations, occupancy, and live updates.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Single-session protection</p>
                  <p className="text-blue-100/90 text-xs">Only one active device is allowed per driver account.</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3 flex items-start gap-3">
                <Clock3 className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Live operational access</p>
                  <p className="text-blue-100/90 text-xs">Track routes and go online as soon as login succeeds.</p>
                </div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3 flex items-start gap-3">
                <KeyRound className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Admin-issued credentials</p>
                  <p className="text-blue-100/90 text-xs">Use the driver username created from the admin dashboard.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-3 bg-white/90 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100">
          {sessionInvalidated && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Session Ended</h3>
                <p className="text-sm text-amber-800">
                  You logged in from another device. Your previous session has been ended for security.
                  <br />
                  <strong>Only one device can be active at a time.</strong>
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg shadow">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Driver Portal</h1>
              <p className="text-sm text-muted-foreground">Sign in using your driver username (DRIVExxxx) or email</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">Username or Email</Label>
              <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="DRIVE0001 or email@example.com" />
            </div>

            <div>
              <Label className="text-sm">Password</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {hasSaved && savedCreds && (
              <div className="p-3 bg-slate-50 border rounded-md text-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-mono break-all">{savedCreds.username}</div>
                  <div className="text-xs text-muted-foreground">Password: {'••••••••'}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                  <Button size="sm" variant="ghost" className="w-full" onClick={useSaved}>Use</Button>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => { try { navigator.clipboard.writeText(`Username: ${savedCreds.username}\nPassword: ${savedCreds.password}`); toast({ title: 'Copied credentials to clipboard' }); } catch (e) { toast({ title: 'Copy failed' }); } }}>Copy</Button>
                  <Button size="sm" variant="secondary" className="w-full" onClick={async () => { await quickLogin(); }}>Quick Login</Button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-800 break-all">Username: <span className="font-mono">{DEMO_USERNAME}</span></p>
              <p className="text-sm text-blue-800 break-all">Password: <span className="font-mono">{DEMO_PASSWORD}</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setIdentifier(DEMO_USERNAME); setPassword(DEMO_PASSWORD); }}>
                  Fill Credentials
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={quickDemoLogin} disabled={isLoading}>
                  <Zap className="h-4 w-4 mr-1" /> Quick Demo Login
                </Button>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Button className="flex-1" onClick={handleLogin} disabled={isLoading}>
                Sign in
              </Button>
              <Button variant="outline" className="min-w-[96px]" onClick={() => { navigate('/admin/login'); }}>Admin</Button>
            </div>

            <div className="text-sm text-muted-foreground mt-2">Tip: the admin dashboard can create driver accounts and provide credentials.</div>
          </div>
          </section>
        </div>
      </div>
    </div>
  );
}