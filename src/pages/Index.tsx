import { EventCard } from '@/components/EventCard';
import { EventLoopPanel } from '@/components/EventLoopPanel';
import { ExecutionLog } from '@/components/ExecutionLog';
import { useEventLoop } from '@/hooks/useEventLoop';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/lib/translations';
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
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation(language);
  const [openSummary, setOpenSummary] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  return (
    <div className="min-h-screen bg-background p-2 sm:p-3 md:p-4 overflow-y-auto transition-colors">
      <div className="mx-auto max-w-[1800px] md:h-screen flex flex-col gap-2 sm:gap-3 pb-4 sm:pb-0">
        {/* Navbar */}
        <div className="flex items-center justify-between flex-shrink-0 rounded-md border bg-card/60 backdrop-blur px-2 sm:px-3 py-2 shadow-sm">
          <div className="space-y-0.5 flex-1 min-w-0 pr-2">
            <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-foreground leading-tight truncate">{t.title}</h1>
            <p className="text-xs sm:text-[11px] text-muted-foreground truncate">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Label htmlFor="auto-mode" className="text-xs sm:text-sm">{t.auto}</Label>
              <Switch id="auto-mode" checked={eventLoop.isAutomatic} onCheckedChange={eventLoop.setIsAutomatic} />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Label htmlFor="navbar-speed" className="text-xs sm:text-sm">{t.speed}</Label>
              <Select value={eventLoop.speed} onValueChange={(v) => eventLoop.setSpeed(v as any)}>
                <SelectTrigger id="navbar-speed" className="h-8 w-[110px] text-xs text-foreground" aria-label={t.selectSpeed}>
                  <SelectValue placeholder={t.selectSpeed} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">{t.speedSlow}</SelectItem>
                  <SelectItem value="normal">{t.speedNormal}</SelectItem>
                  <SelectItem value="fast">{t.speedFast}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={eventLoop.reset}
              variant="outline"
              size="sm"
              className="h-7 sm:h-8 px-1.5 sm:px-2"
              title={t.reset}
              aria-label={t.resetSimulation}
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              onClick={toggleLanguage}
              variant="ghost"
              size="sm"
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-base sm:text-lg"
              aria-label="Change language"
              title="Cambiar idioma / Change language"
            >
              {language === 'es' ? '🇦🇷' : '🇺🇸'}
            </Button>
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              aria-label={t.theme}
              title={t.theme}
            >
              {theme === 'light' ? <Moon className="h-3 w-3 sm:h-4 sm:w-4" /> : <Sun className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <Button
              onClick={() => setOpenAbout(true)}
              variant="secondary"
              size="sm"
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-sm sm:text-base"
              title={t.about}
              aria-label={t.about}
            >
              ℹ️
            </Button>
          </div>
        </div>

        {/* Mobile Controls - Visible only on small screens */}
        <div className="sm:hidden flex items-center justify-between gap-3 rounded-md border bg-card/60 backdrop-blur px-3 py-2 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-mode-mobile" className="text-xs">{t.auto}</Label>
            <Switch id="auto-mode-mobile" checked={eventLoop.isAutomatic} onCheckedChange={eventLoop.setIsAutomatic} />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Label htmlFor="mobile-speed" className="text-xs">{t.speed}</Label>
            <Select value={eventLoop.speed} onValueChange={(v) => eventLoop.setSpeed(v as any)}>
              <SelectTrigger id="mobile-speed" className="h-8 w-full text-xs text-foreground" aria-label={t.selectSpeed}>
                <SelectValue placeholder={t.selectSpeed} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">{t.speedSlow}</SelectItem>
                <SelectItem value="normal">{t.speedNormal}</SelectItem>
                <SelectItem value="fast">{t.speedFast}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Event Cards Grid - Top Section (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
          <EventCard
            type="sync"
            defaultName={t.syncCode}
            defaultCode="console.log('1️⃣ Start');"
            description={t.syncDesc}
            onLoad={eventLoop.loadEvent}
            language={language}
          />
          <EventCard
            type="setTimeout"
            defaultName="setTimeout"
            defaultCode="console.log('5️⃣ Timeout 1');"
            defaultDelay={0}
            description={t.setTimeoutDesc}
            onLoad={eventLoop.loadEvent}
            language={language}
          />
          <EventCard
            type="promise"
            defaultName="Promise"
            defaultCode="Promise.resolve().then(() => console.log('3️⃣ Promise 1'));"
            description={t.promiseDesc}
            onLoad={eventLoop.loadEvent}
            language={language}
          />
          <EventCard
            type="fetch"
            defaultName="Fetch API"
            defaultCode="fetch('https://api.example.com/data').then(res => console.log('4️⃣ Fetch response'));"
            description={t.fetchDesc}
            onLoad={eventLoop.loadEvent}
            language={language}
          />
        </div>

        {/* Bottom Section - Visualization: 60% Event Loop (izq) / 40% Log (der) */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-6 flex-1 min-h-0 px-1 pb-6">
          {/* Izquierda 60% - Event Loop + Botones */}
          <div className="min-h-[400px] lg:min-h-0 flex flex-col justify-between">
            <EventLoopPanel tasks={eventLoop.tasks} language={language} />
            {/* Botones alineados con la base del Log */}
            <div className="flex justify-between items-end mt-4 gap-2">
              {/* Botón Ver resumen (izquierda) */}
              {eventLoop.hasFinished && (
                <Button
                  onClick={() => setOpenSummary(true)}
                  variant="secondary"
                  className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm shadow-md bg-secondary/80 hover:bg-secondary backdrop-blur"
                  title={t.viewSummary}
                >
                  {t.viewSummary}
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
                className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm shadow-md"
                title={
                  eventLoop.hasFinished 
                    ? t.restartSimulation
                    : eventLoop.isAutomatic 
                      ? t.execute
                      : t.nextStep
                }
              >
                {eventLoop.hasFinished 
                  ? t.restart
                  : eventLoop.isAutomatic 
                    ? t.execute
                    : t.nextStep
                }
              </Button>
            </div>
          </div>
          {/* Derecha 40% - Log de Ejecución */}
          <div className="min-h-[300px] lg:min-h-0 flex flex-col">
            <h2 className="text-sm font-medium px-1 mb-2">{t.executionLog}</h2>
            <ExecutionLog logs={eventLoop.logs} language={language} />
          </div>
        </div>



        {/* Modal de resumen final */}
        <SummaryDialog 
          open={openSummary}
          onOpenChange={setOpenSummary}
          loaded={eventLoop.loadedEvents}
          logs={eventLoop.logs}
          language={language}
        />

        {/* Modal Acerca de */}
        <AboutDialog open={openAbout} onOpenChange={setOpenAbout} language={language} />
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
  language,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  loaded: LoadedEvent[];
  logs: { id: string; message: string; timestamp: number }[];
  language: 'es' | 'en';
}) {
  const t = useTranslation(language);
  const executionItems = logs.filter(l => l.message.startsWith('Executing:'));
  const outputItems = logs.filter(l => l.message.startsWith('OUTPUT:'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t.summaryTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Izquierda: Orden de carga + Orden de ejecución */}
          <div className="space-y-4">
            {/* Orden de carga */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t.loadedEvents}</h4>
              <div className="rounded-md border p-2 max-h-40 overflow-auto text-xs">
                {loaded.length === 0 ? (
                  <p className="text-muted-foreground">{t.noEvents}</p>
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
              <h4 className="text-sm font-medium">{t.executionOrder}</h4>
              <div className="rounded-md border p-2 max-h-64 overflow-auto text-xs">
                {executionItems.length === 0 ? (
                  <p className="text-muted-foreground">{t.noSteps}</p>
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
            <h4 className="text-sm font-medium">{t.outputs}</h4>
            <div className="rounded-md border p-2 max-h-[380px] overflow-auto text-xs">
              {outputItems.length === 0 ? (
                <p className="text-muted-foreground">{t.noOutputs}</p>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t.closeSummary}</Button>
          <Button onClick={() => { onOpenChange(false); location.reload(); }}>{t.restartSimulation}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AboutDialog({ open, onOpenChange, language }: { open: boolean; onOpenChange: (v: boolean) => void; language: 'es' | 'en' }) {
  const t = useTranslation(language);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/20 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {t.aboutTitle}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {t.aboutSubtitle}
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* ¿Qué es? */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🧠</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  {t.whatIsTitle}
                </h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p>• <strong>{t.whatIsPoint1}</strong> {t.whatIsPoint1Desc}</p>
                  <p>• <strong>{t.whatIsPoint2}</strong> {t.whatIsPoint2Desc}</p>
                  <p>• <strong>{t.whatIsPoint3}</strong>{t.whatIsPoint3Desc}</p>
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
                  {t.howWorksTitle}
                </h3>
                <div className="space-y-3 text-sm text-green-800 dark:text-green-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span><strong>{t.howWorksPoint1}</strong> {t.howWorksPoint1Desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span><strong>{t.howWorksPoint2}</strong> {t.howWorksPoint2Desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{t.howWorksPoint3} <strong>{t.howWorksPoint3Desc}</strong> {t.howWorksPoint3Desc2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>{t.howWorksPoint4} <strong>{t.howWorksPoint4Desc}</strong> {t.howWorksPoint4Desc2}</span>
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
                  {t.priorityTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-300 dark:border-blue-700">
                      <span className="text-xl">🔹</span>
                      <div>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">{t.priority1}</div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">{t.priority1Desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-300 dark:border-purple-700">
                      <span className="text-xl">🟣</span>
                      <div>
                        <div className="font-semibold text-purple-900 dark:text-purple-100">{t.priority2}</div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">{t.priority2Desc}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
                      <span className="text-xl">🟢</span>
                      <div>
                        <div className="font-semibold text-green-900 dark:text-green-100">{t.priority3}</div>
                        <div className="text-xs text-green-700 dark:text-green-300">{t.priority3Desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-300 dark:border-orange-700">
                      <span className="text-xl">🟠</span>
                      <div>
                        <div className="font-semibold text-orange-900 dark:text-orange-100">{t.priority4}</div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">{t.priority4Desc}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg border border-primary/20">
                  <p className="text-xs text-center text-primary dark:text-blue-300 font-medium">
                    {t.tipLabel} <strong>{t.tipStrong}</strong> {t.tipText}
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
            {t.understood}
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
