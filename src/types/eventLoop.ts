export type QueueType = 'callStack' | 'webApi' | 'microtask' | 'callback';

export type EventType = 'sync' | 'setTimeout' | 'promise' | 'fetch';

export interface Task {
  id: string;
  type: EventType;
  name: string;
  queue: QueueType;
  timestamp: number;
  delay?: number;
  code?: string;
  registrationOrder?: number;
}

export interface EventConfig {
  type: EventType;
  name: string;
  code: string;
  delay?: number;
  url?: string;
}

export interface LogEntry {
  id: string;
  message: string;
  type: QueueType;
  timestamp: number;
}

export type ExecutionSpeed = 'slow' | 'normal' | 'fast';

export interface ExecutionState {
  isRunning: boolean;
  isAutomatic: boolean;
  speed: ExecutionSpeed;
  currentStep: number;
}
