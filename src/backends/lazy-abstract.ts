export abstract class LazyAbstractBackend {

    abstract initialize(): Promise<LazyAbstractBackend>;
    abstract push(...args: any[]): any;
    abstract pull(): any;

    static init(backend: any, ...args: any[]){
        const queueMethods = ["push", "pull"];

        // This proxy will lazily load the queue the first time a queue method is used
        return new Proxy(backend, {
            get(target, key) {
                if(~queueMethods.indexOf(key as string)) {
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

                }
            }
        })
    }
}