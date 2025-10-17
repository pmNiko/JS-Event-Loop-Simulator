# JavaScript Event Loop Simulator

A visual, interactive simulator for understanding the JavaScript Event Loop, built with React, Vite, Tailwind CSS, and Framer Motion. This tool helps developers and students visualize how synchronous and asynchronous code is executed in JavaScript, including the Call Stack, Web APIs, Microtask Queue, and Callback Queue.

## Features

- **Visual Event Loop**: Real-time visualization of the Call Stack, Web APIs, Microtask Queue, and Callback Queue.
- **Interactive Code Blocks**: Editable code examples for synchronous code, setTimeout, Promises, and Fetch API.
- **Execution Modes**: Automatic or manual step-by-step execution.
- **Speed Control**: Adjustable execution speed for better understanding.
- **Execution Log**: Detailed log of each step in the Event Loop.
- **Summary Modal**: Comprehensive summary of loaded events, execution order, and outputs.
- **Educational Tooltips**: Hover over panels for explanations.
- **Dark/Light Theme**: Toggle between themes for comfort.
- **Responsive Design**: Works on desktop and mobile.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **shadcn/ui** - UI components

## Getting Started

1. Clone the repository:
   ```sh
   git clone <YOUR_GIT_URL>
   cd visual-event-sim
   ```

2. Install dependencies:
   ```sh
   npm i
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and navigate to the provided local URL.

## How to Use

1. **Load Events**: Use the code blocks at the top to load different types of events (sync, setTimeout, Promise, Fetch).
2. **Configure Execution**: Choose between automatic or manual execution, and adjust the speed.
3. **Run Simulation**: Click "Execute" to start the simulation, or use "Next Step" for manual control.
4. **View Results**: Watch the Event Loop visualization and check the execution log for details.
5. **Summary**: After execution, view the summary modal for a complete overview.

## Educational Value

This simulator is perfect for:
- Understanding JavaScript's single-threaded nature
- Learning about asynchronous programming
- Visualizing the Event Loop's priority system
- Debugging async code behavior
- Teaching JavaScript concepts

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the simulator.

## License

This project is open source and available under the MIT License.
