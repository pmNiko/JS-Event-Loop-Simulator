import { EventCard } from '@/components/EventCard';
import { EventLoopPanel } from '@/components/EventLoopPanel';
import { ExecutionLog } from '@/components/ExecutionLog';
import { useEventLoop } from '@/hooks/useEventLoop';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sun, Moon, RotateCcw, Play, SkipForward } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { useState, useMemo } from 'react';

const Index = () => {
  const eventLoop = useEventLoop();
  const { theme, toggleTheme } = useTheme();
  const [openSummary, setOpenSummary] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  return (
    <div className="min-h-screen bg-background p-3 md:p-4 overflow-hidden transition-colors">
      <div className="mx-auto max-w-[1800px] h-screen flex flex-col gap-3">
        {/* Navbar */}
        <div className="flex items-center justify-between flex-shrink-0 rounded-md border bg-card/60 backdrop-blur px-3 py-2 shadow-sm">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-2xl font-bold text-foreground leading-none">JavaScript Event Loop Simulator</h1>
            <p className="text-[11px] text-muted-foreground">Visualización interactiva del flujo síncrono y asíncrono</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-mode" className="text-xs">Auto</Label>
              <Switch id="auto-mode" checked={eventLoop.isAutomatic} onCheckedChange={eventLoop.setIsAutomatic} />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Label className="text-xs">Velocidad</Label>
              <Select value={eventLoop.speed} onValueChange={(v) => eventLoop.setSpeed(v as any)}>
                <SelectTrigger className="h-8 w-[110px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Lenta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Rápida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={eventLoop.reset}
              variant="outline"
              size="sm"
              className="h-8 px-2"
              title="Reiniciar"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="Cambiar tema"
              title="Tema"
            >
              {theme === 'light' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
            </Button>
            <Button
              onClick={() => setOpenAbout(true)}
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0"
              title="Acerca del Event Loop"
            >
              ℹ️
            </Button>
          </div>
        </div>

        {/* Event Cards Grid - Top Section (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
          <EventCard
            type="sync"
            defaultName="Código Síncrono"
            defaultCode="console.log('1️⃣ Start');"
            description="Ejecución inmediata en el Call Stack"
            onLoad={eventLoop.loadEvent}
          />
          <EventCard
            type="setTimeout"
            defaultName="setTimeout"
            defaultCode="console.log('5️⃣ Timeout 1');"
            defaultDelay={0}
            description="Callback Queue con retraso"
            onLoad={eventLoop.loadEvent}
          />
          <EventCard
            type="promise"
            defaultName="Promise"
            defaultCode="Promise.resolve().then(() => console.log('3️⃣ Promise 1'));"
            description="Microtask Queue con prioridad"
            onLoad={eventLoop.loadEvent}
          />
          <EventCard
            type="fetch"
            defaultName="Fetch API"
            defaultCode="fetch('https://api.example.com/data').then(res => console.log('4️⃣ Fetch response'));"
            description="Web APIs + Promises combinados"
            onLoad={eventLoop.loadEvent}
          />
        </div>

        {/* Bottom Section - Visualization: 60% Event Loop (izq) / 40% Log (der) */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 flex-1 min-h-0 px-1 pb-6">
          {/* Izquierda 60% */}
          <div className="min-h-0 flex flex-col">
            <EventLoopPanel tasks={eventLoop.tasks} />
          </div>
          {/* Derecha 40% */}
          <div className="min-h-0 flex flex-col">
            <h3 className="text-xs font-medium px-1 mb-2">📋 Log de Ejecución</h3>
            <ExecutionLog logs={eventLoop.logs} />
          </div>
        </div>
        
        {/* Botones alineados con el borde inferior del Log */}
        <div className="flex justify-between items-end px-1 pb-6">
          {/* Botón Ver resumen (izquierda) */}
          {eventLoop.hasFinished && (
            <Button
              onClick={() => setOpenSummary(true)}
              variant="secondary"
              className="h-9 px-4 shadow-md bg-secondary/80 hover:bg-secondary backdrop-blur"
              title="Ver resumen"
            >
              📊 Ver resumen
            </Button>
          )}
          
          {/* Botón Ejecutar (derecha) */}
          <Button
            onClick={() => {
              if (eventLoop.hasFinished) {
                eventLoop.reset();
              } else if (eventLoop.isAutomatic) {
                eventLoop.start();
              } else {
                eventLoop.nextStep();
              }
            }}
            disabled={!eventLoop.hasFinished && !eventLoop.hasTasksInQueue}
            variant="outline"
            className="h-9 px-4 shadow-md"
            title={
              eventLoop.hasFinished 
                ? "Reiniciar simulación" 
                : eventLoop.isAutomatic 
                  ? "Ejecutar simulación" 
                  : "Siguiente paso"
            }
          >
            {eventLoop.hasFinished 
              ? "🔁 Reiniciar" 
              : eventLoop.isAutomatic 
                ? "⏵ Ejecutar" 
                : "⏭ Siguiente paso"
            }
          </Button>
        </div>



        {/* Modal de resumen final */}
        <SummaryDialog 
          open={openSummary}
          onOpenChange={setOpenSummary}
          loaded={eventLoop.loadedEvents}
          logs={eventLoop.logs}
        />

        {/* Modal Acerca de */}
        <AboutDialog open={openAbout} onOpenChange={setOpenAbout} />
      </div>
    </div>
  );
};

export default Index;

type LoadedEvent = { type: string; name: string };

function SummaryDialog({
  open,
  onOpenChange,
  loaded,
  logs,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  loaded: LoadedEvent[];
  logs: { id: string; message: string; timestamp: number }[];
}) {
  const executionItems = logs.filter(l => l.message.startsWith('Executing:'));
  const outputItems = logs.filter(l => l.message.startsWith('OUTPUT:'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Resumen de ejecución</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Izquierda: Orden de carga + Orden de ejecución */}
          <div className="space-y-4">
            {/* Orden de carga */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Eventos cargados</h4>
              <div className="rounded-md border p-2 max-h-40 overflow-auto text-xs">
                {loaded.length === 0 ? (
                  <p className="text-muted-foreground">Sin eventos</p>
                ) : (
                  <ol className="list-decimal list-inside space-y-1">
                    {loaded.map((e, i) => (
                      <li key={`${e.name}-${i}`}>{e.type} → {e.name}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
            {/* Orden de ejecución */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Orden de ejecución</h4>
              <div className="rounded-md border p-2 max-h-64 overflow-auto text-xs">
                {executionItems.length === 0 ? (
                  <p className="text-muted-foreground">Sin pasos ejecutados</p>
                ) : (
                  <ol className="list-decimal list-inside space-y-1">
                    {executionItems.map((l, i) => (
                      <li key={l.id}>
                        {formatExecutionItemLog(l)}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
          {/* Derecha: Outputs */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Outputs (console.log)</h4>
            <div className="rounded-md border p-2 max-h-[380px] overflow-auto text-xs">
              {outputItems.length === 0 ? (
                <p className="text-muted-foreground">Sin outputs</p>
              ) : (
                <ol className="list-decimal list-inside space-y-1">
                  {outputItems.map((l, i) => (
                    <li key={l.id}>
                      {formatOutputItem(l.message)}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar resumen</Button>
          <Button onClick={() => { onOpenChange(false); location.reload(); }}>Reiniciar simulación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AboutDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/20 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            🧠 Event Loop de JavaScript
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Aprende cómo JavaScript maneja múltiples tareas sin bloquearse
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* ¿Qué es? */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🧠</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  ¿Qué es el Event Loop?
                </h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p>• <strong>JavaScript es single-threaded</strong> - solo puede hacer una cosa a la vez</p>
                  <p>• <strong>El Event Loop</strong> coordina múltiples tareas sin bloquear la ejecución principal</p>
                  <p>• <strong>Gracias a él</strong>, el navegador puede seguir respondiendo mientras procesa operaciones asíncronas</p>
                </div>
              </div>
            </div>
          </div>

          {/* ¿Cómo funciona? */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚙️</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                  ¿Cómo funciona?
                </h3>
                <div className="space-y-3 text-sm text-green-800 dark:text-green-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span><strong>Call Stack</strong> ejecuta el código principal de forma síncrona</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span><strong>Web APIs</strong> gestionan tareas asíncronas como fetch, setTimeout o event listeners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Cuando terminan, sus resultados se envían a las <strong>colas</strong> (Microtasks o Callbacks)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>El <strong>Event Loop</strong> decide cuándo procesarlas según su prioridad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orden de prioridad */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl p-6 border border-orange-200/50 dark:border-orange-800/50">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔄</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">
                  Orden de prioridad (flujo visual)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-300 dark:border-blue-700">
                      <span className="text-xl">🔹</span>
                      <div>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">1️⃣ Call Stack</div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">Código síncrono</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-300 dark:border-purple-700">
                      <span className="text-xl">🟣</span>
                      <div>
                        <div className="font-semibold text-purple-900 dark:text-purple-100">2️⃣ Web APIs</div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">Manejan tareas externas</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
                      <span className="text-xl">🟢</span>
                      <div>
                        <div className="font-semibold text-green-900 dark:text-green-100">3️⃣ Microtask Queue</div>
                        <div className="text-xs text-green-700 dark:text-green-300">Promesas y procesos inmediatos</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-300 dark:border-orange-700">
                      <span className="text-xl">🟠</span>
                      <div>
                        <div className="font-semibold text-orange-900 dark:text-orange-100">4️⃣ Callback Queue</div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">Timeouts, eventos, etc.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-center text-primary dark:text-blue-300 font-medium">
                    💡 <strong>Tip:</strong> Las microtareas siempre se ejecutan antes que los callbacks, 
                    sin importar cuándo se registraron
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-200"
          >
            ✨ Entendido - ¡A simular!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatExecutionItemLog(l: { message: string }) {
  const raw = l.message.replace('Executing: ', '').trim();
  
  // Call Stack: código síncrono, registros de setTimeout/Promise/Fetch
  if (/Call Stack|register|create|init/i.test(raw)) {
    return `Call Stack → ${clean(raw)}`;
  }
  
  // Microtask Queue: solo promesas (Promise.then, fetch response)
  if (/Microtask|then|response/i.test(raw)) {
    return `Microtask Queue → ${clean(raw)}`;
  }
  
  // Callback Queue: setTimeout, setInterval, y otros callbacks
  if (/ready|timeout|callback/i.test(raw)) {
    return `Callback Queue → ${clean(raw)}`;
  }
  
  // Web APIs: fases de espera (no se ejecutan directamente)
  if (/Web APIs|waiting|request/i.test(raw)) {
    return `Web APIs → ${clean(raw)}`;
  }
  
  // Fallback
  return `Call Stack → ${clean(raw)}`;
}

function formatOutputItem(message: string) {
  const text = message.replace('OUTPUT: ', '').trim();
  return `💬 "${text}"`;
}

function clean(s: string) {
  return s
    .replace(/^Call Stack\s*→\s*/i, '')
    .replace(/^Web APIs\s*→\s*/i, '')
    .replace(/^Microtask Queue\s*→\s*/i, '')
    .replace(/^Callback Queue\s*→\s*/i, '');
}
