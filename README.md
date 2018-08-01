# Student Performance Activity Monitoring

This is a work in progress.

## Some cool stuff
This project is meant to demonstrate some way way awesome features in JS/TypeScript, including:

* Decorators
* Proxies
* Dependency injection

It represents the culmination of my thinking about doing server stuff in Node.

### Dependency injectoin example

```typescript

import {Service, Injector, Factory} from "../decorators/service.decorator";

// Things that might be injected should be annotated with @Service()
@Service()
export class SomeService {
    
    constructor(private SomeDependency: d) {
        // Instance automatically gets its dependencies injected
        console.log(this.d.name);    // KT
    }
    
    getName(){
        return this.d.name;
    }
    
}

@Service()
export class SomeDependency {
    name = "KT"
    constructor(){
        
    }
}

const thing = Injector.resolve<SomeService>(SomeService);
thing.getName();        // KT

// If you need more complicated instantiation:

@Service()
export class ComplexBackend {
    constructor(private db) {
        
    }
    
    // Use a static method as a factory
    @Factory()
    static async init(baseConfig: ApplicationConfiguration){
        const db = new Postgres({
            user: baseConfig.user,
            password: baseConfig.password
        });
        
        // There's even a complex example in the code where initialization is asynchronous
        return new ComplexBackend(db);
    }
}

@Service
export class Controller {
    constructor(backend: ComplexBackend) {
        
    }
}

// etc
```

### Koa decorators for easy routing
```typescript
import {Service, Injector} from "./decorators/service.decorator";
import {Router, Route, RequiredParameters} from "./decorators/route.decorator";
import KoaRouter = require("koa-router");
import Koa = require("koa");

@Service()
@Router("/forms")
export class MyRouter extends KoaRouter {
    @Route({method: "post", path: "/submit"})
    @RequiredParameters("request.body.formBody")
    async submitForm(ctx: Koa.Context){
        ctx.body = await this.controller.submit(ctx.body.formBody)
    }
    
    constructor(protected controller: SomeController) {
        super();
    }
}

@Service()
export class SomeController {
    async submit(){
        // do some kind of submission
        return {};
    }
}
@Service()
export class MainServer extends Koa {
    
    constructor(router: MyRouter) {
        super();
        this.use("/api/", router.routes())
    }
}

const server = Injector.resolve<MainServer>(MainServer);

server.listen(3000);

```