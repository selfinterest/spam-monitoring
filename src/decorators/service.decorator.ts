import "reflect-metadata";

export interface Type<T> {
    new(...args: any[]): T;
}
export type GenericClassDecorator<T> = (target: T) => void;

export const Service = (): GenericClassDecorator<Type<Object>> => {
    return (target: Type<object>) => {

    }
}

export const Injector = new class {
    resolve<T>(target: Type<any>): T {
        let tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        console.log(tokens);
        let injections = tokens.map ( (token: any) => Injector.resolve<any>(token));

        return new target(...injections);

    }
}
