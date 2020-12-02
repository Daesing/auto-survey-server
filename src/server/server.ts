import { DatabaseConnector, SurveyUserCredentials } from "./database";
import * as jsonreader from '../util/jsonreader';
import { MinuteRepeater } from "../util/minuterepeater";
import { EduroSurveyApi } from "../eduroapi";



export class AutoSurveyServer {



    public database : DatabaseConnector;
    private repeater : MinuteRepeater;



    constructor(dbfile: string) {
        let db_data = jsonreader.readSync(dbfile);
        this.database = new DatabaseConnector({
            host: db_data['host'],
            user: db_data['user'],
            password: db_data['password'],
        })
        
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

        if(schools.length == 0) throw '학교 검색결과가 없습니다.';
    }



    async doSurveys(date: Date) {
        let credentials = await this.database.getUsers(date);

        for(let credential of credentials) {
            await this.doUserSurvey(credential);
        }
    }


    async start() : Promise<AutoSurveyServer> {
        await this.database.setup();
        
        this.repeater.start();
        return this;
    }
}