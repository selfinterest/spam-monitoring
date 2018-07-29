import {Factory, Service} from "../decorators/service.decorator";
import {EventEmitter} from "events";
import {SpamConfig} from "../config";
import _amqp = require("amqplib");
import {Channel, Connection} from "amqplib";

@Service()
export class RabbitMqBackend extends EventEmitter {

    protected channel: Promise<Channel>;
    //protected queue: Promise<Channel>;

    constructor(protected config: SpamConfig, protected amqp = _amqp){
        super();

        this.channel = Promise.resolve(
            this.amqp.connect(config.get("inqeueaddress"))
        ).then( conn => {
            return conn.createChannel()
        }).then ( ch => {
            return ch.assertQueue("inqueue").then( ok => {
                if(ok) {
                    console.log("Opened queue");
                    return ch;
                } else {
                    throw new Error("Could not open queue");
                }

            })
        })
        // We use Promise.resolve to coerce the Bluebird promise into a stanard one.
        /*this.channel = Promise.resolve(amqp.connect(config.get("inqueueaddress")).then( conn => conn.createChannel()));
        /*this.queue = Promise.resolve(this.channel.then( ch => ch.assertQueue("inqueueaddress")));*/
    }

    @Factory()
    static init(config: SpamConfig){
        return new RabbitMqBackend(config);
    }


    pull() {
        return this.channel.then( ch => {
            return ch.get("inqueue");
        })
    }

    push(e: any){
        return this.channel.then( ch => {
            return ch.sendToQueue("inqueue", Buffer.from(e))
        })
        //this.queue()
    }

}