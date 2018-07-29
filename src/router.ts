import {Service} from "./decorators/service.decorator";
import {SpamConfig} from "./config";
import {AlertsController} from "./controllers";
import {Route, Router} from "./decorators/route.decorator";
import Koa = require("koa");
import KoaRouter = require("koa-router");
import mount = require("koa-mount");

@Service()
@Router("/alerts")
export class AlertsRouter extends KoaRouter{

    constructor(protected config: SpamConfig, protected alertsController: AlertsController){
        super();
    }

    @Route()
    async getAlerts(ctx: Koa.Context) {
        ctx.body = await this.alertsController.getAlerts();
    }

    @Route({method: "post"})
    async postAlert(ctx: Koa.Context) {
        const result = await this.alertsController.pushAlert(ctx.request.body);
        ctx.body = result;
    }

}

// The main router
@Service()
@Router()
export class SpamRouter extends KoaRouter {

    private readonly apiVersion = "v1";

    // A status route
    @Route()
    test(ctx: Koa.Context){
        ctx.body = {ok: true};
    }

    constructor(protected config: SpamConfig, protected alertsRouter: AlertsRouter){
        super();

        // Mount the router on API
        this.use("/api/" + this.apiVersion, alertsRouter.routes());

    }
}