import { DatabaseConnector, SurveyUserCredentials } from "./database";
import { MinuteRepeater } from "../util/minuterepeater";
import { EduroSurveyApi } from "../eduroapi";
import * as timeutil from '../util/timeutil'
import { ConnectionConfig } from "mysql";



export class AutoSurveyServer {



    public database : DatabaseConnector;
    private repeater : MinuteRepeater;



    constructor(dbconfig : ConnectionConfig) {
        
        process.stdout.write('Establishing database connector... ');
        this.database = new DatabaseConnector(dbconfig);
        console.log('✔');

        this.repeater = new MinuteRepeater(date => {
            this.doSurveys(date)
        });
    }



    async doUserSurvey(credentials: SurveyUserCredentials) {

        let schools = (await EduroSurveyApi.searchSchool(credentials.province, credentials.school_type, credentials.school)).schulList;
        
        let user = await EduroSurveyApi.findUser({
            birthday: credentials.birthday,
            loginType: 'school',
            name: credentials.name,
            orgCode: schools[0].orgCode,
            stdntPNo: null
        });

        let participant = (await user.getParticipantPreviews())[0];

        let pinfo = await participant.getParticipantInfo();
        await pinfo.doSurvey();

    }



    async doSurveys(date: Date) {
        process.stdout.write(`checking time id ${timeutil.timeTo4digit(date)}... `);

        let credentials = await this.database.getUsers(date);

        for(let credential of credentials) {
            await this.doUserSurvey(credential);
        }

        if(credentials.length != 0) {
            console.log(`✔ (${credentials.length} result(s))`);
        }
        else {
            console.log(`✔ (no results)`);
        }

        this.database.setLastCheckedTime(date);
    }


    async start() : Promise<AutoSurveyServer> {
        process.stdout.write('Setting up the database... ');
        await this.database.setup();
        console.log('✔');
        
        process.stdout.write('Starting up repeater... ');
        this.repeater.start();
        console.log('✔');
        return this;
    }
}