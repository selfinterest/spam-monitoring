import Koa = require("koa");
import {SpamConfig} from "./config";
import {Service} from "./decorators/service.decorator";
import logger = require("koa-logger");
import {SpamRouter} from "./router";

@Service()
export class SpamServer extends Koa {
    private readonly port: string;

    constructor(protected config: SpamConfig, protected router: SpamRouter) {
        super();

        this.port = this.config.get("PORT");
    }


    start(){
        this.use(logger());
        this.use(this.router.routes());
        this.listen(this.port, () => {
            console.log('SPAM server listening on ' + this.port);
        })

    }
}