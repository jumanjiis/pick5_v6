import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = true
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="w-full">
      <Collapsible.Trigger className="w-full bg-white/10 rounded-t-xl p-4 flex items-center justify-between hover:bg-white/20 transition-colors">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-lg font-semibold text-white">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-purple-200" />
        ) : (
          <ChevronDown className="h-5 w-5 text-purple-200" />
        )}
      </Collapsible.Trigger>
      
      <Collapsible.Content>
        <div className="bg-white/5 rounded-b-xl p-4 border-t border-purple-500/20">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleSection;