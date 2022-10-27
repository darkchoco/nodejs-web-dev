import EventEmitter from 'events';

export class Pulser extends EventEmitter {
    start() {
        // 반복적으로 callback을 실행하도록 setup.
        setInterval(() => {
            console.log(`${new Date().toISOString()} >>>> pulse`);
            this.emit('pulse');
            console.log(`${new Date().toISOString()} <<<< pulse`);
        }, 1000);
    }
}
