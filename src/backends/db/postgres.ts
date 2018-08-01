import {Factory, Service} from "../../decorators/service.decorator";
import {SpamConfig} from "../../config";
import {LazyAbstractBackend} from "../lazy-abstract";
import pgPromise = require("pg-promise");
import {IDatabase, IMain} from "pg-promise";

@Service()
export class PostgresBackend extends LazyAbstractBackend {

    db!: IDatabase<any>;

    private readonly connectionString = "postgres://localhost";

    queueMethods = ["count", "pullAverage"];

    constructor(protected config: SpamConfig, protected _pgp: () => IMain = pgPromise){
        super();
    }

    private async createGradeTable(){
        await this.db.query(
            'CREATE SCHEMA IF NOT EXISTS myschema'
        );

        await this.db.query(`CREATE OR REPLACE FUNCTION trigger_set_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`);

        await this.db.query(
            'DROP TABLE IF EXISTS myschema.grades'
        );

        await this.db.query(
            `CREATE TABLE IF NOT EXISTS myschema.grades
                (
                    id integer PRIMARY KEY,
                    grade integer,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    completed_at TIMESTAMPTZ
                )
            `
        );

        await this.db.query(
            `CREATE TRIGGER set_timestamp
                BEFORE UPDATE ON myschema.grades
                FOR EACH ROW
                EXECUTE PROCEDURE trigger_set_timestamp();
            `
        );
    }

    async initialize(){
        if(this.db) return this;
        const pgp = this._pgp();
        this.db = pgp({
            user: "postgres",
            password: "password",
            database: "postgres"
        });

       await this.createGradeTable();

       return await this;
    }

    async push(grade: any){
        return await this.db.query(
            'INSERT INTO myschema.grades (id, grade) VALUES (${id}, ${grade}) ' +
            'ON CONFLICT (id) DO UPDATE SET grade = ${grade} WHERE grades.id = ${id}',
            grade
        )
    }

    async pull(){
        return await this.db.query("SELECT * FROM myschema.grades");
    }

    async count(){
        return await this.db.query("SELECT COUNT(*) FROM myschema.grades");
    }

    async pullAverage(){
        return await this.db.query(
            `SELECT avg(myschema.grades.grade) FROM myschema.grades`
        )
    }


    @Factory()
    static init(config: SpamConfig){
        return super.init<PostgresBackend>(new PostgresBackend(config)); // invoke the lazy backend

    }

}