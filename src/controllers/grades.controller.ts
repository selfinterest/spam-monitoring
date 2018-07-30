import {Service} from "../decorators/service.decorator";
import {PostgresBackend} from "../backends/db/postgres";

@Service()
export class GradesController {
    constructor(protected db: PostgresBackend){

    }


    async getGrades(){
        return await this.db.pull();
    }

    async postGrade(){
        return await this.db.push(1234);
    }



}