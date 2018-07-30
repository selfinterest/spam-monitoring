import {Factory, Service} from "../decorators/service.decorator";
import {EventEmitter} from "events";
import {SpamConfig} from "../config";
import _amqp = require("amqplib");
import {Channel, Connection} from "amqplib";
import {MemoryQueueBackend} from "./memory";

export interface QueueConfig {
    name: string;
    address: string;
}
@Service()
export class RabbitMqBackend  {

    //protected channel!: Channel;
    protected channel: any;

    protected readonly queueConfig: QueueConfig;

    constructor(protected config: SpamConfig, protected amqp = _amqp){
        this.queueConfig = config.get("alerts.queue");

        /*this.initializeQueue().catch( e => {
            throw e;
        })*/
    }

    @Factory()
    static init(config: SpamConfig){
        const backend = new RabbitMqBackend(config);
        const queueMethods = ["push", "pull"];

        // This proxy will lazily load the queue the first time a queue method is used
        return new Proxy(backend, {
            get(target, key) {
                if(~queueMethods.indexOf(<string>key)) {
                    const method = (target as any)[key];

                    return async function(...args: any[]) {
                        const t = await target.initializeQueue();
                        const result = method.apply(target, args);
                        return await result;
                    }

                }
            }
        })

    }

    async initializeQueue(){
        if(this.channel) return this.channel;
        const connection = await this.amqp.connect(this.queueConfig.address);
        const channel = await connection.createChannel();
        if(await channel.assertQueue(this.queueConfig.name)) {
            console.log("opened queue");
        } else {
            throw new Error("Could not open queue");
        }

        this.channel = channel;

        return this.channel;
    }

    async pull() {
        return await this.channel.get(this.queueConfig.name);
    }

    async push(e: any){
        return await this.channel.sendToQueue(this.queueConfig.name, Buffer.from(e))
    }

}