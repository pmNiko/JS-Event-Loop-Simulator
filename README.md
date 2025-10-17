# Simulador Visual del Event Loop de JavaScript

Un simulador visual e interactivo para entender el Event Loop de JavaScript, construido con React, Vite, Tailwind CSS y Framer Motion. Esta herramienta ayuda a desarrolladores y estudiantes a visualizar cómo se ejecuta el código síncrono y asíncrono en JavaScript, incluyendo el Call Stack, Web APIs, Microtask Queue y Callback Queue.

## Características

- **Event Loop Visual**: Visualización en tiempo real del Call Stack, Web APIs, Microtask Queue y Callback Queue.
- **Bloques de Código Interactivos**: Ejemplos de código editables para código síncrono, setTimeout, Promises y Fetch API.
- **Modos de Ejecución**: Ejecución automática o manual paso a paso.
- **Control de Velocidad**: Velocidad de ejecución ajustable para mejor comprensión.
- **Log de Ejecución**: Registro detallado de cada paso en el Event Loop.
- **Modal de Resumen**: Resumen completo de eventos cargados, orden de ejecución y salidas.
- **Tooltips Educativos**: Pasa el mouse sobre los paneles para ver explicaciones.
- **Tema Oscuro/Claro**: Alternar entre temas para mayor comodidad.
- **Diseño Responsivo**: Funciona en escritorio y móvil.

## Stack Tecnológico

- **React** - Framework de UI
- **Vite** - Herramienta de construcción
- **TypeScript** - Seguridad de tipos
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **shadcn/ui** - Componentes de UI

## Comenzar

1. Clona el repositorio:
   ```sh
   git clone <YOUR_GIT_URL>
   cd visual-event-sim
   ```

2. Instala las dependencias:
   ```sh
   npm i
   ```

3. Inicia el servidor de desarrollo:
   ```sh
   npm run dev
   ```

4. Abre tu navegador y navega a la URL local proporcionada.

## Cómo Usar

1. **Cargar Eventos**: Usa los bloques de código en la parte superior para cargar diferentes tipos de eventos (síncrono, setTimeout, Promise, Fetch).
2. **Configurar Ejecución**: Elige entre ejecución automática o manual, y ajusta la velocidad.
3. **Ejecutar Simulación**: Haz clic en "Ejecutar" para iniciar la simulación, o usa "Siguiente paso" para control manual.
4. **Ver Resultados**: Observa la visualización del Event Loop y revisa el log de ejecución para detalles.
5. **Resumen**: Después de la ejecución, ve el modal de resumen para una vista completa.

## Valor Educativo

Este simulador es perfecto para:
- Entender la naturaleza single-threaded de JavaScript
- Aprender sobre programación asíncrona
- Visualizar el sistema de prioridades del Event Loop
- Debuggear comportamiento de código asíncrono
- Enseñar conceptos de JavaScript

## Contribuir

Siéntete libre de enviar issues, solicitudes de características o pull requests para mejorar el simulador.

## Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.