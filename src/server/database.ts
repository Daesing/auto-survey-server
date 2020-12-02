import mysql, { Connection, ConnectionConfig } from 'mysql';
import { EduroSurveyApi } from '../eduroapi';
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
                '`birthday` VARCHAR(6) NOT NULL,' +
                '`name` VARCHAR(32) NOT NULL,' +
                '`province` VARCHAR(32) NOT NULL,' +
                '`school_type` VARCHAR(32) NOT NULL,' +
                '`school` VARCHAR(32) NOT NULL,' +
                '`survey_time` VARCHAR(4) NOT NULL' +
            `) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
        )
    }



    async setup() {
        await this.connect();
        await this.setupDatabase();
    }



    async getUsers(date: Date = new Date()) : Promise<SurveyUserCredentials[]> {
        return new Promise<SurveyUserCredentials[]>((res, rej) => {
            let date_digit = dateutil.date24digit(date);
            this.connection.query(
                'SELECT * FROM `auto_survey`.`students_info` WHERE `survey_time`=?',
                [date_digit],
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
            if(!school) rej('No such school exists.');

            let user = await EduroSurveyApi.findUser({
                birthday: credentials.birthday,
                loginType: 'school',
                name: credentials.name,
                orgCode: school.schulList[0].orgCode,
                stdntPNo: null
            })
            if(!user) rej('No such survey user exists.')

            this.connection.query(
                'INSERT INTO `auto_survey`.`students_info` VALUES(?,?,?,?,?,?)',
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
                'SELECT @autosurvey_lastchecked',
                (error, result) => {
                    if(error) rej(error)
                    res(result[0]['@autosurvey_lastchecked']);
                }
            )
        })
    }


    
    async setLastCheckedTime(time: string) : Promise<void> {
        return new Promise<void>((res, rej) => {
            this.connection.query(
                'SET @autosurvey_lastchecked=?', [time],
                error => {
                    if(error) rej(error)
                    res();
                }
            )
        })
    }
}