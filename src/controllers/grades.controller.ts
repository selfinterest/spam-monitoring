import {Service} from "../decorators/service.decorator";
import {PostgresBackend} from "../backends/db/postgres";

@Service()
export class GradesController {
    constructor(protected db: PostgresBackend){

    }


    async getGrades(){
        return await this.db.pull();
    }

    async postGrade(gradeInfo: any){
        return await this.db.push(gradeInfo);
    }

    async getAverage(){
        return await this.db.pullAverage();
    }



}