import { Pulser } from './pulser.mjs';

// Instantiate a Pulser object
const pulser = new Pulser();

// Handler function.
// 'pulse'라는 event를 위한 listener 구현.
pulser.on('pulse', () => {
    console.log(`${new Date().toISOString()} pulse received`);
});

// Start it pulsing
pulser.start();
