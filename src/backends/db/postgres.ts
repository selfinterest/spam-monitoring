import {Factory, Service} from "../../decorators/service.decorator";
import {SpamConfig} from "../../config";
import {LazyAbstractBackend} from "../lazy-abstract";
import pgPromise = require("pg-promise");
import {IDatabase, IMain} from "pg-promise";

@Service()
export class PostgresBackend extends LazyAbstractBackend {

    db!: IDatabase<any>;

    private readonly connectionString = "postgres://localhost";

    constructor(config: SpamConfig, protected _pgp: () => IMain = pgPromise){
        super();
    }

    async initialize(){
        if(this.db) return this;
        const pgp = this._pgp();
        this.db = pgp({
            user: "postgres",
            password: "password",
            database: "postgres"
        });

        await this.db.query(
            'CREATE SCHEMA IF NOT EXISTS myschema'
        );

        await this.db.query(
            "CREATE TABLE IF NOT EXISTS myschema.grades (i integer)"
        );

        return await this;
    }

    async push(grade: any){
        return await this.db.query(
            "INSERT INTO myschema.grades (i) VALUES (1234)"
        )
    }

    async pull(){
        return await this.db.query("SELECT * FROM myschema.grades");
    }


    @Factory()
    static init(config: SpamConfig){
        const backend = new PostgresBackend(config);
        return super.init(backend);
        //return new PostgresBackend(config);

    }

}