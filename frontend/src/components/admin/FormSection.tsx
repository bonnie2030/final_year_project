import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('border-t pt-6 mt-6 first:border-t-0 first:pt-0 first:mt-0', className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-600 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}
