export abstract class LazyAbstractBackend  {

    abstract initialize(): Promise<LazyAbstractBackend>;
    abstract push(...args: any[]): any;
    abstract pull(...args: any[]): any;

     _queueMethods = ["push", "pull"];
    abstract queueMethods: string[] = [];

    static init<T extends LazyAbstractBackend>(...args: any[]){
        const backend: T = args[0];     // yay generics!
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
        })
    }
}