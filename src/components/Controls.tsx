import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutionSpeed } from '@/types/eventLoop';
import { Play, RotateCcw, SkipForward, Sun, Moon } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  isAutomatic: boolean;
  speed: ExecutionSpeed;
  theme: 'light' | 'dark';
  hasTasksInQueue: boolean;
  onStart: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onToggleAutomatic: (checked: boolean) => void;
  onSpeedChange: (speed: ExecutionSpeed) => void;
  onToggleTheme: () => void;
}

export function Controls({
  isRunning,
  isAutomatic,
  speed,
  theme,
  hasTasksInQueue,
  onStart,
  onReset,
  onNextStep,
  onToggleAutomatic,
  onSpeedChange,
  onToggleTheme,
}: ControlsProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium">Controles de Ejecución</CardTitle>
          <Button
            id="theme-toggle"
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="h-8 w-8 p-0"
            aria-label="Toggle theme"
            title="Tema"
          >
            {theme === 'light' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-3 pb-3">
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-mode" className="text-xs">Ejecución Automática</Label>
            <Switch
              id="auto-mode"
              checked={isAutomatic}
              onCheckedChange={onToggleAutomatic}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="execution-speed" className="text-xs">Velocidad</Label>
            <Select value={speed} onValueChange={(value) => onSpeedChange(value as ExecutionSpeed)}>
              <SelectTrigger id="execution-speed" className="h-8 text-xs text-foreground" aria-label="Velocidad de ejecución">
                <SelectValue placeholder="Seleccionar velocidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Lenta</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Rápida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button 
            onClick={onStart} 
            disabled={isRunning || !hasTasksInQueue}
            className="min-w-[120px]"
            size="sm"
          >
            <Play className="h-3 w-3 mr-1" />
            Iniciar
          </Button>
          <Button 
            onClick={onReset}
            variant="outline"
            className="min-w-[120px]"
            size="sm"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reiniciar
          </Button>
        </div>

        {!isAutomatic && (
          <Button 
            onClick={onNextStep}
            disabled={!isRunning || !hasTasksInQueue}
            variant="secondary"
            className="w-full"
            size="sm"
          >
            <SkipForward className="h-3 w-3 mr-1" />
            Ejecutar Siguiente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
