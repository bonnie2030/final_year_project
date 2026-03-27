import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mail, Phone, Zap, Truck } from 'lucide-react';

type Driver = {
  id: number;
  user_id?: number;
  userId?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  profile_image?: string | null;
  driving_license?: string | null;
  assigned_vehicle_id?: number | null;
  vehicle_reg?: string | null;
};

interface DriverCardProps {
  driver: Driver;
  onEdit: () => void;
  onResetPassword: () => void;
  onDelete: () => void;
  onUploadPhoto: (file: File) => void;
  isUploadingPhoto?: boolean;
  onAssignmentClick: () => void;
  assignmentContent?: React.ReactNode;
}

export default function DriverCard({
  driver,
  onEdit,
  onResetPassword,
  onDelete,
  onUploadPhoto,
  isUploadingPhoto,
  onAssignmentClick,
  assignmentContent,
}: DriverCardProps) {
  const driverId = driver.user_id || driver.userId || driver.id;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Header with avatar and basic info */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0">
              {driver.profile_image ? (
                <img src={driver.profile_image} alt={driver.name} className="h-full w-full object-cover" />
              ) : (
                String((driver.name || driver.username || 'D')).charAt(0).toUpperCase()
              )}
            </div>

            {/* Name and ID */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900">{driver.name || driver.username}</h3>
                <Badge variant="outline" className="text-xs">{driver.username}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                {driver.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                )}
              </div>
              {driver.phone && (
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                  <Phone className="w-3 h-3" />
                  {driver.phone}
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Badge */}
          {driver.vehicle_reg ? (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">{driver.vehicle_reg}</span>
            </div>
          ) : (
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">No vehicle</span>
            </div>
          )}
        </div>

        {/* License info if present */}
        {driver.driving_license && (
          <div className="mt-2 text-xs text-slate-600">
            <span className="font-medium">License:</span> {driver.driving_license}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-b bg-slate-50">
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              disabled={isUploadingPhoto}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadPhoto(file);
                e.currentTarget.value = '';
              }}
            />
            <span className="px-3 py-2 text-xs font-medium rounded-md border border-slate-300 bg-white hover:bg-slate-50 cursor-pointer transition inline-flex items-center">
              {isUploadingPhoto ? '⏳ Uploading...' : '📷 Photo'}
            </span>
          </label>
          <Button size="sm" variant="outline" onClick={onEdit} className="text-xs h-9">
            ✏️ Edit
          </Button>
          <Button size="sm" variant="outline" onClick={onResetPassword} className="text-xs h-9">
            🔑 Password
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete} className="text-xs h-9">
            🗑️ Delete
          </Button>
        </div>
      </div>

      {/* Assignment section */}
      <div className="p-4">
        <button
          onClick={onAssignmentClick}
          className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1 hover:text-slate-900 transition"
        >
          <Zap className="w-4 h-4" />
          Assign Route & Vehicle
        </button>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          {assignmentContent}
        </div>
      </div>
    </Card>
  );
}
