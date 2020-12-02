import * as timeutil from './timeutil';

export class MinuteRepeater {
    private call : (date: Date) => void;
    private lastCall : string;

    constructor(call: (date: Date) => void) {
        this.call = call;
    }

    private checkncall(date: Date = new Date()) {
        if(this.lastCall ? (timeutil.timeTo4digit(date) !== this.lastCall) : true) {
            this.call(date);
            this.lastCall = timeutil.timeTo4digit(date);
        }
    }

    async start() {
        return setInterval(() => {
            this.checkncall();
        }, 30000);
    }
}