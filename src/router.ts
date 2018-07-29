import {Service} from "./decorators/service.decorator";
import {SpamConfig} from "./config";
import {SpamController} from "./controllers";
import {AlertsController} from "./controllers/alerts.controller";
import {Route, Router} from "./decorators/route.decorator";
import Koa = require("koa");
import KoaRouter = require("koa-router");

@Service()
@Router("/alert")
export class AlertsRouter extends KoaRouter{

    constructor(protected config: SpamConfig){
        super();
    }

    @Route({path: "/"})
    getRoute(ctx: Koa.Context){

    }

    test(){
        console.log("How?");
    }
}

@Service()
@Router()
export class SpamRouter extends KoaRouter {

    @Route("/")
    test(ctx: Koa.Context){
        ctx.body = {ok: true, config: this.config.toString()}
    }

    @Route("/alerts")
    getAlerts(ctx: Koa.Context){
        ctx.body = this.alerts.getAlerts();
    }


    constructor(protected config: SpamConfig, protected alerts: AlertsController){
        super();
    }
}