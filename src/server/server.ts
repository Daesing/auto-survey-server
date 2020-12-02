import { DatabaseConnector, SurveyUserCredentials } from "./database";
import * as jsonreader from '../util/jsonreader';
import { MinuteRepeater } from "../util/minuterepeater";
import { EduroSurveyApi } from "../eduroapi";



export class AutoSurveyServer {



    private dbc : DatabaseConnector;
    private repeater : MinuteRepeater;



    constructor(dbfile: string) {
        let db_data = jsonreader.readSync(dbfile);
        this.dbc = new DatabaseConnector({
            host: db_data['host'],
            user: db_data['user'],
            password: db_data['password'],
        })
        
        this.repeater = new MinuteRepeater(date => {
            console.log(date);
            this.doSurveys(date)
        });
    }



    async doUserSurvey(credentials: SurveyUserCredentials) {
        console.log('로그인 정보: {\n' + 
            `    생일: ${credentials.birthday},\n` + 
            `    이름: ${credentials.name},\n\n` + 

            `    행정 구역: ${credentials.province},\n` + 
            `    학교급: ${credentials.schoolType},\n` + 
            `    학교: ${credentials.school},\n` + 
        '}\n');

        let schools = (await EduroSurveyApi.searchSchool(credentials.province, credentials.schoolType, credentials.school)).schulList;
        
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
        let credentials = await this.dbc.getUsers(date);

        for(let credential of credentials) {
            await this.doUserSurvey(credential);
        }
    }



    async start() {
        await this.dbc.connect();
        await this.dbc.setupDatabase();
        this.repeater.start();
    }
}