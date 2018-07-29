//import "reflect-metadata";

const metadatakey = Symbol.for("spam_metadata");
const isResolved = Symbol.for("spam_is_resolved");
const factoryMethodKey = Symbol.for("spam_factory");


export interface Type<T> {
    new(...args: any[]): T;
}
export type GenericClassDecorator<T> = (target: T) => void;

export type GenericStaticPropertyDecorator<T> =
    (target: Type<T>, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor

export interface FactoryMethodPropertyDescriptor<T>{
    value?: () => T
}
export const Service = (): GenericClassDecorator<Type<object>> => {
    return (target: Type<object>) => {
        console.log(target);
    }
}

export const Inject = () => {
    return (...args: any[]): void => {
        let target, propertyKey;
        if(args.length === 3) {
            [target, propertyKey] = args;
            let dependencies = Reflect.getMetadata(metadatakey, target) || [];

            dependencies = dependencies.concat(propertyKey);

            Reflect.defineMetadata(metadatakey, dependencies, target);


        }




        //return "a";
    }
}

export const Factory = (): GenericStaticPropertyDecorator<object> => {
    return (target: Type<object>, key: string, descriptor: FactoryMethodPropertyDescriptor<object>) => {
        Reflect.defineMetadata(factoryMethodKey, key, target );

        return descriptor;
    }
}

const dependencies = new Map<string, any>();

export const Injector = new class {
    getTokensFromConstructor(target: Type<any>){
        //return Reflect.getMetadata('design:paramtypes', target) || [];
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        return {
            /*factoryFn: function(...args: any[]){
                return new target(...args)
            },*/
            tokens

        }
    }

    getTokensFromFactoryMethod(target: Type<any>) {
        let factoryMethod = Reflect.getMetadata(factoryMethodKey, target) || null;
        if(factoryMethod) {
            return {
                factoryFn: Reflect.get(target, factoryMethod).bind(this),
                tokens: Reflect.getMetadata("design:paramtypes", target, factoryMethod) || []
            }
        }

        return {};
    }

    resolve<T>(target: Type<any>): T {
        let resolved = Reflect.getMetadata(isResolved, target);

        if(resolved) return resolved;

        let {tokens, factoryFn} = this.getTokensFromFactoryMethod(target);

        if(!tokens) {   //get tokens from constructor iff we don't have a factory method
            let stuff = this.getTokensFromConstructor(target);
            tokens = stuff.tokens;
        }

        let injections = tokens.map ( (token: any) => Injector.resolve<any>(token));
        const thing = factoryFn ? factoryFn(...injections) : new target(...injections);

        Reflect.defineMetadata(isResolved, thing, target);

        return thing;

    }
}
