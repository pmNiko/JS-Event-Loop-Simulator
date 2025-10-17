import { motion, AnimatePresence } from 'framer-motion';
import { Task, QueueType } from '@/types/eventLoop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EventLoopPanelProps {
  tasks: Task[];
}

const queueConfig = {
  callStack: { title: 'Call Stack', color: 'hsl(var(--call-stack))', tip: 'Pila de llamadas donde se ejecuta el código síncrono.' },
  webApi: { title: 'Web APIs', color: 'hsl(var(--web-api))', tip: 'APIs del navegador que gestionan operaciones asíncronas (timers, fetch, etc.).' },
  microtask: { title: 'Microtask Queue', color: 'hsl(var(--microtask))', tip: 'Cola de alta prioridad (promesas cumplidas, mutation observers).' },
  callback: { title: 'Callback Queue', color: 'hsl(var(--callback))', tip: 'Cola de callbacks de menor prioridad (timers, eventos de UI).' },
};

export function EventLoopPanel({ tasks }: EventLoopPanelProps) {
  const getTasksByQueue = (queue: QueueType) => tasks.filter(t => t.queue === queue);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      <h3 className="text-xs font-medium px-1">Event Loop</h3>
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        {(Object.keys(queueConfig) as QueueType[]).map(queue => {
          const config = queueConfig[queue];
          const queueTasks = getTasksByQueue(queue);

          return (
            <motion.div
              key={`${queue}-${queueTasks.length}`}
              initial={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
              animate={{ boxShadow: `0 0 24px ${config.color}40` }}
              transition={{ duration: 0.25 }}
              className="rounded-md"
            >
              <Card className="flex flex-col min-h-0">
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-center justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CardTitle className="text-xs font-medium cursor-help">{config.title}</CardTitle>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                        {config.tip}
                      </TooltipContent>
                    </Tooltip>
                    <Badge variant="secondary" className="text-xs h-5 px-1.5">
                      {queueTasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-auto px-3 pb-3">
                <AnimatePresence mode="popLayout">
                  <div className="space-y-1.5">
                    {queueTasks.map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          boxShadow: `0 0 20px ${config.color}80`
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                        className="rounded-md p-1.5 text-xs font-mono"
                        style={{
                          backgroundColor: `${config.color}18`,
                          border: `1px solid ${config.color}`,
                        }}
                      >
                        {task.name}
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
