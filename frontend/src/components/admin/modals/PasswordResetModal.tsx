import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PasswordResetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username?: string;
  password?: string;
}

export default function PasswordResetModal({ open, onOpenChange, username, password }: PasswordResetModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = `Username: ${username}\nPassword: ${password}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: 'Credentials copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Password Reset Successful</DialogTitle>
          <DialogDescription>Share these credentials securely with the driver. They can change their password after first login.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">USERNAME</p>
                <p className="font-mono text-sm font-medium text-slate-900 break-all">{username}</p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">PASSWORD</p>
                <p className="font-mono text-sm font-medium text-slate-900 break-all">{password}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-900">
              <strong>⚠️ Security Tip:</strong> Send credentials through a secure channel. Don't share in insecure chats or emails.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleCopy} className={`${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> Copy Credentials
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
