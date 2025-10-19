import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventConfig, EventType } from '@/types/eventLoop';
import { Code2, Clock, Sparkles, Globe } from 'lucide-react';
import { Language } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

interface EventCardProps {
  type: EventType;
  defaultName: string;
  defaultCode: string;
  defaultDelay?: number;
  description: string;
  onLoad: (config: EventConfig) => void;
  language: Language;
}

const iconMap = {
  sync: Code2,
  setTimeout: Clock,
  promise: Sparkles,
  fetch: Globe,
};

export function EventCard({ type, defaultName, defaultCode, defaultDelay, description, onLoad, language }: EventCardProps) {
  const t = useTranslation(language);
  const [name, setName] = useState(defaultName);
  const [code, setCode] = useState(defaultCode);
  const [delay, setDelay] = useState(defaultDelay || 1000);

  const Icon = iconMap[type];

  const handleLoad = () => {
    onLoad({
      type,
      name,
      code,
      delay: type === 'setTimeout' ? delay : undefined,
    });
  };

  return (
    <Card className="h-full flex flex-col transition-colors">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm">{defaultName}</CardTitle>
        </div>
        <CardDescription className="text-[10px]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5 px-3 pb-3 flex-1 flex flex-col">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.eventName}
          className="text-xs h-7"
        />
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t.codeToExecute}
          className="font-mono text-[10px] min-h-[60px] resize-none flex-1"
        />
        {type === 'setTimeout' && (
          <Input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            placeholder={t.delayMs}
            className="text-xs h-7"
          />
        )}
        <Button onClick={handleLoad} size="sm" className="w-full h-7 text-xs mt-auto">
          {t.loadEvent}
        </Button>
      </CardContent>
    </Card>
  );
}
