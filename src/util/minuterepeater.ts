import * as dateutil from './dateutil';

export class MinuteRepeater {
    private call : (date: Date) => void;
    private lastCall : string;

    constructor(call: (date: Date) => void) {
        this.call = call;
    }

    private checkncall(date: Date = new Date()) {
        if(this.lastCall ? (dateutil.date24digit(date) !== this.lastCall) : true) {
            this.call(date);
            this.lastCall = dateutil.date24digit(date);
        }
    }

    async start() {
        this.checkncall();
        return setInterval(() => {
            this.checkncall();
        }, 30000);
    }
}