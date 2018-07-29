
import KoaRouter = require("koa-router");
import Koa = require("koa");
import {type} from "os";

export interface RouteConfig {
    method?: string;
    path: string;
}


const routerMetadata = Symbol.for("routerMetadata");


export const Route = function(routeConfigAsMaybeString: RouteConfig | string = {method: "get", path: "/"}) {
    /*return function(target: any, key: string, descriptor: any) {

    }*/

    const routeConfig = typeof(routeConfigAsMaybeString) === "string" ? {
        method: "get",
        path: routeConfigAsMaybeString
    } : routeConfigAsMaybeString;

    routeConfig.method = routeConfig.method || "get";

    return function (...args: any[]) {


        const [target, key, descriptor] = args;
        const fn = descriptor.value;  //the actual method we will call

        //target.test();

        //Reflect.defineMetadata(routerMetadata, {"name": "bob"}, target);
        descriptor.value = function(router: any) {
            router[routeConfig.method as string](routeConfig.path, fn.bind(this));
        }

        const keys = Reflect.getMetadata(routerMetadata, target) || [];


        keys.push(key);
        Reflect.defineMetadata(routerMetadata, keys, target);

        //console.log(Reflect.getMetadataKeys(target));
        return descriptor;
        /*const router = target[routerMetadata];
        router[routeConfig.method as string](routeConfig.path, (ctx: Koa.Context) => {
            ctx.body = "I am a route!";
        })*/

    }
}

export const Router = function(routerConfig: any = {}) {
    if(typeof routerConfig === "string") routerConfig = {
        prefix: routerConfig
    };

    return function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
        //console.log("bklah", Reflect.getMetadataKeys(constructor));
        //const r = new KoaRouter(routerConfig);
        return class extends constructor {
           //[routerMetadata] = new KoaRouter(routerConfig);
            constructor(...args: any[]){
                super(...args);


                const router = this;
                const keys = Reflect.getMetadata(routerMetadata, this);
                keys.forEach( (key: string) => {
                  if(key in this) {
                      const fn = (this as any)[key].bind(router);
                      fn(router);   // this looks ridiculous
                  }
                })

            }
        }
    }
}