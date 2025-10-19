import { useRef, useEffect, useMemo } from 'react';
import { LogEntry, QueueType } from '@/types/eventLoop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';

interface ExecutionLogProps {
  logs: LogEntry[];
  language: Language;
}

const logEmoji: Record<QueueType, string> = {
  callStack: '🔵',
  webApi: '🟣',
  microtask: '🟢',
  callback: '🟠',
};

export function ExecutionLog({ logs, language }: ExecutionLogProps) {
  const t = useTranslation(language);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recent = useMemo(() => logs.slice(-20), [logs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="flex flex-col min-h-0 flex-1 mb-4" style={{ maxHeight: 'calc(100vh - 450px)' }}>
      <CardContent className="p-3 flex-1 min-h-0 overflow-hidden">
        {/* Mini timeline */}
        <div className="pb-2">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div className="flex h-full gap-[2px]">
              <AnimatePresence initial={false}>
                {recent.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 18, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    style={{ background: colorFor(log.type) }}
                    className="rounded-sm"
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="space-y-1 pb-3">
            {logs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">{t.noLogs}</p>
            ) : (
              logs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ backgroundColor: 'transparent' }}
                  animate={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                  transition={{ duration: 0.3 }}
                  className="rounded px-1"
                >
                  <div className="text-xs font-mono flex items-start gap-1.5 py-0.5">
                    <span>{logEmoji[log.type]}</span>
                    <span className="text-muted-foreground text-[10px]">#{idx + 1}</span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function colorFor(type: QueueType) {
  switch (type) {
    case 'callStack':
      return 'hsl(var(--call-stack))';
    case 'webApi':
      return 'hsl(var(--web-api))';
    case 'microtask':
      return 'hsl(var(--microtask))';
    case 'callback':
      return 'hsl(var(--callback))';
  }
}
