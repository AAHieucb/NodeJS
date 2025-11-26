const { Worker } = require('worker_threads');

console.log('Starting heavy task...');

const worker = new Worker('./worker.js');

// Có thể convert sang async await
worker.on('message', (result) => {
  console.log('Result from worker:', result);
});

console.log('Main thread is still free!');
