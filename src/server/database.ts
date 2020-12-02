import mysql, { Connection, ConnectionConfig } from 'mysql';
import { EduroSurveyApi, SurveyUser } from '../eduroapi';
import * as timeutil from '../util/timeutil';



export interface SurveyUserCredentials {
    birthday: string;
    name: string;
    province: string;
    school_type: string;
    school: string;
    survey_time: string;
}



export class DatabaseConnector {


    
    private connectionOptions : ConnectionConfig;
    private connection : Connection;



    constructor(connectionOptions: ConnectionConfig) {
        this.connectionOptions = connectionOptions;
    }



    async connect() {
        return new Promise<void>((res, rej) => {
            this.connection = mysql.createConnection(this.connectionOptions);
            this.connection.connect(error => {
                if(error) rej(error);
                res();
            })
        })
    }



    async setupDatabase() {
        this.connection.query('CREATE DATABASE IF NOT EXISTS `auto_survey`');
        this.connection.query(
            'CREATE TABLE IF NOT EXISTS `auto_survey`.`students_info` (' +
                '`id` INT AUTO_INCREMENT PRIMARY KEY,' +
                '`birthday` VARCHAR(6) NOT NULL,' +
                '`name` VARCHAR(32) NOT NULL,' +
                '`province` VARCHAR(32) NOT NULL,' +
                '`school_type` VARCHAR(32) NOT NULL,' +
                '`school` VARCHAR(32) NOT NULL,' +
                '`survey_time` VARCHAR(4) NOT NULL' +
            `) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
        );
        this.connection.query(
            'CREATE TABLE IF NOT EXISTS `auto_survey`.`variables` (' +
                '`key` VARCHAR(32) NOT NULL PRIMARY KEY,' +
                '`value` VARCHAR(32) NOT NULL' +
            `) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
        )
    }



    async setup() {
        await this.connect();
        await this.setupDatabase();
    }



    async getUsers(date: Date = new Date()) : Promise<SurveyUserCredentials[]> {
        return new Promise<SurveyUserCredentials[]>(async (res, rej) => {
            
            let date_digit = timeutil.timeTo4digit(date);
            let lastchecktime = await this.getLastCheckedTime();

            this.connection.query(
                'SELECT * FROM `auto_survey`.`students_info` WHERE ' +
                    '? < `survey_time` AND `survey_time` <= ?',
                [lastchecktime, date_digit],
                (error, result) => {
                    if(error) rej(error);
                    res(result);
                }
            );
        })
    }



    async registerUser(credentials: SurveyUserCredentials) {
        return new Promise<void>(async (res, rej) => {

            let school = await EduroSurveyApi.searchSchool(credentials.province, credentials.school_type, credentials.school);

            if(school.schulList.length == 0) {
                rej('검색결과에 맞는 학교 정보가 없습니다.');
                return;
            }

            let user : SurveyUser;

            try {
                user = await EduroSurveyApi.findUser({
                    birthday: credentials.birthday,
                    loginType: 'school',
                    name: credentials.name,
                    orgCode: school.schulList[0].orgCode,
                    stdntPNo: null
                })
                if(!user) {
                    throw '';
                }
            } catch(e) {
                rej('검색 결과에 맞는 참여자 정보가 없습니다.')
                return;
            }

            this.connection.query(
                'INSERT INTO `auto_survey`.`students_info`(birthday, name, province, school_type, school, survey_time) VALUES(?,?,?,?,?,?)',
                [
                    credentials.birthday,
                    credentials.name,
                    credentials.province,
                    credentials.school_type,
                    credentials.school,
                    credentials.survey_time,
                ],
                (error) => {
                    if(error) rej(error);
                    res();
                }
            )
        })
    }


    
    async getLastCheckedTime() : Promise<string> {
        return new Promise<string>((res, rej) => {
            this.connection.query(
                'SELECT `value` FROM `auto_survey`.`variables` WHERE `key`="lastchecktime"',
                (error, result) => {
                    if(error) rej(error)
                    res(!result ? null : result[0]['value']);
                }
            )
        })
    }


    
    async setLastCheckedTime(time: Date | string) : Promise<void> {
        return new Promise<void>((res, rej) => {
            let result = typeof time === 'string' ? time : timeutil.timeTo4digit(time);

            this.connection.query(
                'INSERT INTO `auto_survey`.`variables` values("lastchecktime", ?) ' +
                    'on duplicate key update `value`=?', [result, result],
                error => {
                    if(error) rej(error)
                    res();
                }
            )
        })
    }
}