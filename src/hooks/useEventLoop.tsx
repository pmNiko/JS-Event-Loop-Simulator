import { useState, useCallback, useRef, useEffect } from 'react';
import { Task, LogEntry, ExecutionSpeed, EventConfig, QueueType } from '@/types/eventLoop';

const SPEED_DELAYS = {
  slow: 2000,
  normal: 1000,
  fast: 500,
};

export function useEventLoop() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [speed, setSpeed] = useState<ExecutionSpeed>('normal');
  const [currentStep, setCurrentStep] = useState(0);
  const [loadedEvents, setLoadedEvents] = useState<Array<Pick<EventConfig, 'type' | 'name'>>>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [registrationOrder, setRegistrationOrder] = useState(0);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const taskQueueRef = useRef<Task[]>([]);
  const processedFetchIds = useRef<Set<string>>(new Set());

  const addLog = useCallback((message: string, type: QueueType) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const loadEvent = useCallback((config: EventConfig) => {
    const baseTask: Omit<Task, 'id' | 'queue' | 'timestamp'> = {
      type: config.type,
      name: config.name,
      code: config.code,
      delay: config.delay,
    };

    let newTasks: Task[] = [];

    switch (config.type) {
      case 'sync':
        newTasks = [{
          ...baseTask,
          id: `task-${Date.now()}`,
          queue: 'callStack',
          timestamp: Date.now(),
        }];
        break;

      case 'setTimeout':
        newTasks = [
          {
            ...baseTask,
            id: `task-${Date.now()}-stack`,
            queue: 'callStack',
            timestamp: Date.now(),
            name: `${config.name} (register)`,
          },
          {
            ...baseTask,
            id: `task-${Date.now()}-webapi`,
            queue: 'webApi',
            timestamp: Date.now(),
            name: `${config.name} (waiting)`,
          },
        ];
        break;

      case 'promise':
        newTasks = [
          {
            ...baseTask,
            id: `task-${Date.now()}-stack`,
            queue: 'callStack',
            timestamp: Date.now(),
            name: `${config.name} (create)`,
          },
          {
            ...baseTask,
            id: `task-${Date.now()}-microtask`,
            queue: 'microtask',
            timestamp: Date.now() + 100,
            name: `${config.name} (then)`,
          },
        ];
        break;

      case 'fetch':
        // Fetch: solo dos pasos iniciales (init en stack, pending en webApi)
        // La transición a Microtask se maneja en el useEffect cuando Web APIs resuelve
        newTasks = [
          {
            ...baseTask,
            id: `task-${Date.now()}-init`,
            queue: 'callStack',
            timestamp: Date.now(),
            name: `${config.name} (init)`,
          },
          {
            ...baseTask,
            id: `task-${Date.now()}-pending`,
            queue: 'webApi',
            timestamp: Date.now(),
            name: `📡 ${config.name} (pending)`,
          },
        ];
        break;
    }

    taskQueueRef.current = [...taskQueueRef.current, ...newTasks];
    // Mostrar Web APIs en la UI al cargar
    const webApiTasks = newTasks.filter(t => t.queue === 'webApi');
    if (webApiTasks.length > 0) {
      setTasks(prev => [...prev, ...webApiTasks]);
    }
    setLoadedEvents(prev => [...prev, { type: config.type, name: config.name }]);
    addLog(`Event loaded: ${config.name}`, 'callStack');
  }, [addLog]);

  const executeNextTask = useCallback(() => {
    // Excluir tareas de Web APIs (se procesan por temporizador externo)
    const runnable = taskQueueRef.current.filter(t => t.queue !== 'webApi');
    if (runnable.length === 0) {
      setIsRunning(false);
      setHasFinished(true);
      return;
    }

    // Priority: Call Stack > Microtask > Callback (con orden de registro para callbacks)
    const nextTask = runnable.sort((a, b) => {
      const queuePriority = { callStack: 0, microtask: 1, callback: 2, webApi: 3 };
      const priorityDiff = queuePriority[a.queue] - queuePriority[b.queue];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Para callbacks, ordenar por registrationOrder (orden de registro)
      if (a.queue === 'callback' && b.queue === 'callback') {
        return (a.registrationOrder || 0) - (b.registrationOrder || 0);
      }
      
      return a.timestamp - b.timestamp;
    })[0];

  setTasks(prev => (prev.some(t => t.id === nextTask.id) ? prev : [...prev, nextTask]));
    taskQueueRef.current = taskQueueRef.current.filter(t => t.id !== nextTask.id);
    addLog(`Executing: ${nextTask.name}`, nextTask.queue);

    // Simulate task completion and queue transitions
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== nextTask.id));

      // No transiciones desde Web APIs aquí; se gestionan en el temporizador externo

      // Registrar outputs cuando el callback realmente "corre" en el stack
      const outputs = extractOutputs(nextTask);
      outputs.forEach(text => addLog(`OUTPUT: ${text}`, nextTask.queue));

      setCurrentStep(prev => prev + 1);
    }, SPEED_DELAYS[speed] / 2);
  }, [speed, addLog]);

  useEffect(() => {
    if (isRunning && isAutomatic) {
      timeoutRef.current = setTimeout(() => {
        executeNextTask();
      }, SPEED_DELAYS[speed]);
    }

    // Gestionar Web APIs: mover tareas a su siguiente cola cuando corresponda
    const now = Date.now();
    const pendingWebApis = taskQueueRef.current.filter(t => t.queue === 'webApi');
    
    if (pendingWebApis.length > 0) {
      pendingWebApis.forEach((t) => {
        // setTimeout: respeta delay → Callback Queue (con orden de registro)
        if (t.type === 'setTimeout') {
          const due = (t.delay ?? SPEED_DELAYS[speed]) / 1;
          if (!('readyAt' in (t as any))) {
            (t as any).readyAt = now + due;
          }
          if ((t as any).readyAt <= now) {
            taskQueueRef.current = taskQueueRef.current.filter(x => x.id !== t.id);
              // Sincronizar UI: quitar de Web APIs
              setTasks(prev => prev.filter(x => x.id !== t.id));
            const newOrder = registrationOrder;
            setRegistrationOrder(prev => prev + 1);
            taskQueueRef.current.push({ 
              ...t, 
              id: `${t.id}-cb`, 
              queue: 'callback' as QueueType, 
              name: t.name.replace('(waiting)', '(ready)'), 
              timestamp: Date.now(),
              registrationOrder: newOrder
            });
          }
        }

        // fetch: latencia de 800-1000ms antes de pasar a Microtask
        if (t.type === 'fetch') {
          const fetchDelay = 900; // Retraso visible de ~900ms
          if (!('fetchReadyAt' in (t as any))) {
            (t as any).fetchReadyAt = now + fetchDelay;
          }
          // Solo procesar UNA VEZ por fetch
          if ((t as any).fetchReadyAt <= now && !processedFetchIds.current.has(t.id)) {
            processedFetchIds.current.add(t.id); // Marcar como procesado
            // Eliminar de Web APIs
            taskQueueRef.current = taskQueueRef.current.filter(x => x.id !== t.id);
            // Crear tarea en Microtask con ID diferente
            const responseName = t.name.replace('📡 ', '').replace(' (pending)', '');
            const responseTask: Task = {
              ...t,
              id: `${t.id}-response`,
              queue: 'microtask' as QueueType,
              name: `📬 ${responseName} (response)`,
              timestamp: Date.now(),
            };
            taskQueueRef.current.push(responseTask);
            // Sincronizar UI: quitar de Web APIs y agregar a Microtask en una sola operación
            setTasks(prev => [...prev.filter(x => x.id !== t.id), responseTask]);
          }
        }
      });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRunning, isAutomatic, speed, currentStep, executeNextTask, registrationOrder]);

  const start = useCallback(() => {
    setIsRunning(true);
    setHasStarted(true);
    setHasFinished(false);
    addLog('--- Comienza la ejecución ---', 'callStack');
    if (!isAutomatic) {
      executeNextTask();
    }
  }, [isAutomatic, executeNextTask, addLog]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTasks([]);
    setLogs([]);
    setCurrentStep(0);
    setLoadedEvents([]);
    setHasStarted(false);
    setHasFinished(false);
    setRegistrationOrder(0);
    taskQueueRef.current = [];
    processedFetchIds.current.clear(); // Limpiar IDs de fetch procesados
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (!isAutomatic) {
      executeNextTask();
    }
  }, [isAutomatic, executeNextTask]);

  return {
    tasks,
    logs,
    isRunning,
    isAutomatic,
    speed,
    loadEvent,
    start,
    reset,
    nextStep,
    setIsAutomatic,
    setSpeed,
    loadedEvents,
    hasStarted,
    hasFinished,
    hasTasksInQueue: taskQueueRef.current.length > 0 || tasks.length > 0,
  };
}

function extractOutputs(task: Task): string[] {
  const { type, name, code } = task;
  // Evitar outputs en fases de registro
  if (/\(register\)|\(create\)|\(init\)/i.test(name)) return [];
  if (!code) return type === 'fetch' && /\(response\)/i.test(name) ? ['Fetch response'] : [];

  const outputs: string[] = [];
  try {
    const regex = /console\.log\((['"`])([\s\S]*?)\1\)/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(code)) !== null) {
      if (m[2]) outputs.push(m[2]);
    }
  } catch {}

  if (outputs.length === 0 && type === 'fetch' && /\(response\)/i.test(name)) {
    outputs.push('Fetch response');
  }
  return outputs;
}
