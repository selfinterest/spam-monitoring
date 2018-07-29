import {Service} from "./decorators/service.decorator";
import {SpamConfig} from "./config";
import {AlertsController} from "./controllers";
import {Route, Router} from "./decorators/route.decorator";
import Koa = require("koa");
import KoaRouter = require("koa-router");
import mount = require("koa-mount");

@Service()
@Router("/api/alerts")
export class AlertsRouter extends KoaRouter{

    static routerConfiguration: any = {};

    constructor(protected config: SpamConfig){
        super();
        //this.prefix("/api/alerts2");
    }

    @Route()
    getAlerts(ctx: Koa.Context){
        ctx.body = {ok: false};
    }
}

// The main router
@Service()
@Router()
export class SpamRouter extends KoaRouter {

    // A status route
    @Route()
    test(ctx: Koa.Context){
        ctx.body = {ok: true};
    }

    constructor(protected config: SpamConfig, protected alertsRouter: AlertsRouter){
        super();

        // Mount the router on API
        this.use(alertsRouter.routes());

    }
}