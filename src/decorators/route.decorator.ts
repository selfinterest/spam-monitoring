
import KoaRouter = require("koa-router");
import Koa = require("koa");
import {get, partition, last, set} from "lodash";
import compose = require("koa-compose");

export interface RouteConfig {
    method?: string;
    path?: string;
}

export interface RequiredValidator {
    path: string;
    publishPath: string | undefined;
}

const routerMetadata = Symbol.for("routerMetadata");
const validatorMetadata = Symbol.for("validatorMetadata");

const checkValidators = function(router: any, key: string) {
    return (ctx: Koa.Context, next: Function) => {
        const validators = Reflect.getMetadata(validatorMetadata, router, key);
        if(validators) {
            // process the validators
            const required: (RequiredValidator | string)[] = validators.required || [];
            const [notMissing, missing] = partition(required, s => typeof get(ctx, (typeof s === "string" ? s : s.path)) !== "undefined");
            if(missing.length > 0) {
                console.error("Failed validation", missing);
                ctx.throw(400);
            } else {
                notMissing.forEach( s => {
                    let v: RequiredValidator;
                    if(typeof s === "string") {
                        v = {
                            path: s,
                            publishPath: last(s.split("."))
                        }
                    } else {
                        v = s;
                    }

                    if(v.publishPath) {
                        set(ctx, "state." + v.publishPath, get(ctx, v.path));
                    }
                });

                return next();
            }

        } else {
            return next();
        }


    }
}
export const Route = function(routeConfigAsMaybeString: RouteConfig | string = {method: "get", path: "/"}) {
    /*return function(target: any, key: string, descriptor: any) {

    }*/

    const routeConfig = typeof(routeConfigAsMaybeString) === "string" ? {
        method: "get",
        path: routeConfigAsMaybeString
    } : routeConfigAsMaybeString;

    routeConfig.method = routeConfig.method || "get";
    routeConfig.path = routeConfig.path || "/";

    return function (...args: any[]) {


        const [target, key, descriptor] = args;
        const fn = descriptor.value;  //the actual method we will call

        //target.test();

        //Reflect.defineMetadata(routerMetadata, {"name": "bob"}, target);
        descriptor.value = function(router: any) {
            router[routeConfig.method as string](routeConfig.path, checkValidators(router, key), fn.bind(this));
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

                // This applies methods like "prefix" with args passed to decorator
                Object.keys(routerConfig).forEach ( k => {
                    if(k in this) {
                        if(typeof (this as any)[k] === "function") {
                            (this as any)[k].call(this, routerConfig[k]);
                        } else {
                            (this as any)[k] = routerConfig[k];
                        }
                    }
                })

            }
        }
    }
}

export const RequiredParameters = function(...somePaths: string[]){
    return function (...args: any[]) {
        const [target, key] = args;
        const validators = Reflect.getMetadata(validatorMetadata, target, key) || {
            required: [],
            optional: []
        };

        validators.required = [...validators.required, ...somePaths];

        Reflect.defineMetadata(validatorMetadata, validators, target, key);
        //const fn = descriptor.value;

        /*descriptor.value = function(router: any) {

        }*/

        /*descriptor.value = compose([
            (ctx: Koa.Context, next: Function) => {
                ctx.state.test = "aadf";
                return next();
            },
            fn.bind(target)
        ]).bind(target);*/

        /*descriptor.value = async function(...args: any[]) {
            const [ctx] = args;
            ctx.state.test = "asdf";
            return await fn.apply(target, args);
        }*/

        /*descriptor.value = compose(
            [
                async function(ctx: Koa.Context, next: Function) {
                    return next();
                },
                fn.bind(target)
        ]).bind(target);*/

        /*const validator = async function(ctx: Koa.Context, next: Function) {
            ctx.state.test = "adf";
            return await next();
        }.bind(target);*/

        /*const validator = (ctx: Koa.Context) => {
            ctx.state.test = "adf";
        }

        descriptor.value = (ctx: Koa.Context, next: Function) => {
            validator(ctx);
            return fn(ctx, next);
        }*/

        //return descriptor;
    }
}