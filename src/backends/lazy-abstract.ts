import {SpamConfig} from "../config";


/*export const LazyInitialization = function <T extends {new(...args:any[]):{}}>(constructor:T) {
    return (target: T) => {

    }
}*/

/*export const LazyInitialization = () => {
    return function <T extends {new(...args:any[]):{}}>(constructor:T) {
        return new Proxy(constructor, {
            construct(target, args){

            }
        })
    }
}*/

export const LazyInitialization = () => {

}

export abstract class LazyAbstractBackend  {

    abstract initialize(): Promise<LazyAbstractBackend>;
    abstract push(...args: any[]): any;
    abstract pull(...args: any[]): any;

     _queueMethods = ["push", "pull"];  // not satisfied with this. Could be done better with decorators!

    abstract queueMethods: string[] = [];

    protected constructor(...args: any[]){

    }

    static init<T extends LazyAbstractBackend>(backend: T){
        //const backend: T = args[0];     // yay generics!
        const queueMethods = [ ...backend.queueMethods, ...backend._queueMethods];

        // This proxy will lazily load the queue the first time a queue method is used
        return new Proxy(backend, {
            get(target: T, key) {
                if(~queueMethods.indexOf(key as string)) {  // wrap method with an initializer
                    const method = (target as any)[key];

                    return async function(...args: any[]) {
                        try {
                            await target.initialize();
                            const result = method.apply(target, args);
                            return await result;
                        } catch (e) {
                            throw e;
                        }
                    }

                } else {            //simply return the oriignal method
                    return Reflect.get(target, key);
                }
            }
        });
    }
}