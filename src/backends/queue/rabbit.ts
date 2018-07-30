import {Factory, Service} from "../../decorators/service.decorator";
import {EventEmitter} from "events";
import {SpamConfig} from "../../config/index";
import _amqp = require("amqplib");
import {Channel, Connection} from "amqplib";
import {MemoryQueueBackend} from "../memory";

export interface QueueConfig {
    host: string;
    queue: string;
}
@Service()
export class RabbitMqBackend  {

    //protected channel!: Channel;
    protected channel: any;

    protected readonly queueConfig: QueueConfig;

    constructor(protected config: SpamConfig, protected amqp = _amqp){
        this.queueConfig = config.get("alerts.queue");
    }

    @Factory()
    static init(config: SpamConfig){
        const backend = new RabbitMqBackend(config);
        const queueMethods = ["push", "pull"];

        // This proxy will lazily load the queue the first time a queue method is used
        return new Proxy(backend, {
            get(target, key) {
                if(~queueMethods.indexOf(key as string)) {
                    const method = (target as any)[key];

                    return async function(...args: any[]) {
                        try {
                            await target.initializeQueue();
                            const result = method.apply(target, args);
                            return await result;
                        } catch (e) {
                            throw e;
                        }

                    }

                }
            }
        })

    }

    async initializeQueue(){
        if(this.channel) return this.channel;
        const connection = await this.amqp.connect(this.queueConfig.host);
        const channel = await connection.createChannel();
        if(await channel.assertQueue(this.queueConfig.queue)) {
            console.log("opened queue");
        } else {
            throw new Error("Could not open queue");
        }

        this.channel = channel;

        return this.channel;
    }

    async pull() {
        return await this.channel.get(this.queueConfig.queue);
    }

    async push(e: any){
        return await this.channel.sendToQueue(this.queueConfig.queue, Buffer.from(e))
    }

}