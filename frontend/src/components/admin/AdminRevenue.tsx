import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type RevenueByRoute = {
  id?: number;
  route_name?: string;
  revenue?: number | string;
};

type RevenueResponse = {
  total_revenue: number;
  payments_count: number;
  bookings_count: number;
  revenue_by_route: RevenueByRoute[];
};

const AdminRevenue = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState<'day'|'week'|'month'|'range'>('week');

  const { data, isLoading, isError } = useQuery<RevenueResponse>(
    {
      queryKey: ['admin','revenue', period],
      queryFn: () => api.admin.getRevenue({ period }),
    }
  );

  // show toast if error
  if (isError) {
    toast({ title: 'Failed to fetch revenue', description: 'Please try again', variant: 'destructive' });
  }

  const revenueData: RevenueResponse = data || { total_revenue: 0, payments_count: 0, bookings_count: 0, revenue_by_route: [] };
  const chartData = (revenueData.revenue_by_route || []).map((r) => ({ name: r.route_name || `Route ${r.id}`, revenue: Number(r.revenue || 0) }));

  const parsePeriod = (value: string): 'day' | 'week' | 'month' | 'range' => {
    if (value === 'day' || value === 'week' || value === 'month' || value === 'range') return value;
    return 'week';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Revenue summary</p>
          <h4 className="text-lg font-semibold">Total Revenue & Breakdown</h4>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-md border px-3 py-2 bg-background" value={period} onChange={(e) => setPeriod(parsePeriod(e.target.value))}>
            <option value="day">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">This month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-white border">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">KES {isLoading ? '...' : (Number(data?.total_revenue || 0)).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border">
          <p className="text-sm text-muted-foreground">Payments</p>
          <p className="text-2xl font-bold">{isLoading ? '...' : (data?.payments_count || 0)}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border">
          <p className="text-sm text-muted-foreground">Bookings</p>
          <p className="text-2xl font-bold">{isLoading ? '...' : (data?.bookings_count || 0)}</p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white border h-64">
        {isError && <p className="text-sm text-destructive">Failed to load chart</p>}
        {!isError && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value: number | string) => `KES ${Number(value).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminRevenue;
