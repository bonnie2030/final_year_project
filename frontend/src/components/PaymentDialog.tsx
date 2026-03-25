import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, Loader2, Phone, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: number;
  routeId?: number;
  routeName?: string;
  amount?: number;
  onPaymentSuccess: () => void;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  vehicleId,
  routeId,
  routeName = 'Standard Route',
  amount = 50,
  onPaymentSuccess
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'manual' | 'mpesa'>('manual');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const handleManualPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Record manual payment using simulatePayment endpoint with immediate completion
      const res = await fetch(API_BASE + '/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          routeId: routeId || 1,
          amount,
          phoneNumber: 'MANUAL-CASH',
          vehicle: null, // Let backend auto-assign vehicle
          vehicleId: vehicleId
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Payment Recorded',
          description: `Manual payment of KES ${amount} recorded successfully`,
          duration: 3000
        });
        
        // Wait a moment for backend to process occupancy increment
        setTimeout(() => {
          onPaymentSuccess();
          onOpenChange(false);
          resetForm();
        }, 2500);
      } else {
        throw new Error(data.message || 'Failed to record payment');
      }
    } catch (error: any) {
      console.error('Manual payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Could not record payment',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      toast({
        title: 'Phone Number Required',
        description: 'Please enter a valid phone number',
        variant: 'destructive'
      });
      return;
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Initiate M-Pesa payment using the simulate endpoint
      const res = await fetch(API_BASE + '/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          routeId: routeId || 1,
          amount,
          phoneNumber: normalizedPhone,
          vehicleId: vehicleId
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'M-Pesa Prompt Sent',
          description: `Check phone ${normalizedPhone} for M-Pesa prompt`,
          duration: 5000
        });
        
        // Payment will auto-complete after 2 seconds (simulated)
        // Wait for backend to process payment and increment occupancy
        setTimeout(() => {
          toast({
            title: 'Payment Successful',
            description: `M-Pesa payment of KES ${amount} completed`,
            duration: 3000
          });
          onPaymentSuccess();
          onOpenChange(false);
          resetForm();
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('M-Pesa payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Could not initiate M-Pesa payment',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const normalizePhoneNumber = (phone: string): string | null => {
    const digitsOnly = phone.trim().replace(/[^0-9]/g, '');
    
    // 0712345678 -> 254712345678
    if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
      return `254${digitsOnly.slice(1)}`;
    }
    
    // 712345678 -> 254712345678
    if (digitsOnly.startsWith('7') && digitsOnly.length === 9) {
      return `254${digitsOnly}`;
    }
    
    // 254712345678 -> 254712345678
    if (digitsOnly.startsWith('254') && digitsOnly.length === 12) {
      return digitsOnly;
    }
    
    return null;
  };

  const resetForm = () => {
    setPhoneNumber('');
    setPaymentMethod('manual');
    setLoading(false);
  };

  const handleCancel = () => {
    if (!loading) {
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Passenger Payment
          </DialogTitle>
          <DialogDescription>
            Collect payment for the passenger boarding {routeName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'manual' | 'mpesa')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="mpesa" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              M-Pesa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Cash Payment</p>
                  <p className="text-2xl font-bold text-blue-700">KES {amount}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Record that the passenger paid <strong>KES {amount}</strong> in cash. Click "Record Payment" to confirm.
            </p>
          </TabsContent>

          <TabsContent value="mpesa" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Passenger Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678 or 254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter the passenger's phone number to send M-Pesa STK push prompt
              </p>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">M-Pesa Payment</p>
                  <p className="text-2xl font-bold text-green-700">KES {amount}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              The passenger will receive an M-Pesa prompt on their phone to pay <strong>KES {amount}</strong>.
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={paymentMethod === 'manual' ? handleManualPayment : handleMpesaPayment}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : paymentMethod === 'manual' ? (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                Send M-Pesa Prompt
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
