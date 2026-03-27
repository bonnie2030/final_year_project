import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type Driver = {
  id: number;
  user_id?: number;
  userId?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  driving_license?: string;
  assigned_vehicle_id?: number | null;
};

interface EditDriverModalProps {
  open: boolean;
  driver: Driver | null;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { name?: string; phone?: string; driving_license?: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function EditDriverModal({ open, driver, onOpenChange, onSave, isLoading }: EditDriverModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: driver?.name || '',
    phone: driver?.phone || '',
    driving_license: driver?.driving_license || '',
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (err) {
      /* Error handled by parent */
    }
  };

  React.useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        phone: driver.phone || '',
        driving_license: driver.driving_license || '',
      });
    }
  }, [driver, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Driver Information</DialogTitle>
          <DialogDescription>Update driver details below. Click save when done.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone Number</Label>
            <Input
              id="edit-phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-license">Driving License</Label>
            <Input
              id="edit-license"
              placeholder="License number"
              value={formData.driving_license}
              onChange={(e) => setFormData({ ...formData, driving_license: e.target.value })}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
