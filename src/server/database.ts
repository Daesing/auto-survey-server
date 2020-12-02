import mysql, { Connection, ConnectionConfig } from 'mysql';
import * as dateutil from '../util/dateutil';



export interface SurveyUserCredentials {
    birthday: string;
    name: string;
    province: string;
    schoolType: string;
    school: string;
    survey_time_from: string;
    survey_time_to: string;
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
        console.log('Setting database up...');
        this.connection.query('CREATE DATABASE IF NOT EXISTS `auto_survey`');
        console.log('Setting table up...');
        this.connection.query(
            'CREATE TABLE IF NOT EXISTS `auto_survey`.`students_info` (' +
                '`birthday` VARCHAR(6) NOT NULL,' +
                '`name` VARCHAR(32) NOT NULL,' +
                '`province` VARCHAR(32) NOT NULL,' +
                '`schoolType` VARCHAR(32) NOT NULL,' +
                '`school` VARCHAR(32) NOT NULL,' +
                '`survey_time_from` VARCHAR(4) NOT NULL,' +
                '`survey_time_to` VARCHAR(4) NOT NULL' +
            `) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
        )
    }



    async getUsers(date: Date = new Date()) : Promise<SurveyUserCredentials[]> {
        return new Promise<SurveyUserCredentials[]>((res, rej) => {
            let datedigit = dateutil.date24digit(date);
            console.log(datedigit);
            this.connection.query(
                'SELECT * FROM `auto_survey`.`students_info` WHERE `survey_time_from`<=? AND `survey_time_to`>=?',
                [datedigit, datedigit],
                (error, result) => {
                    if(error) rej(error);
                    res(result);
                }
            );
        })
    }



    async registerUser(user: SurveyUserCredentials) {
        return new Promise<void>((res, rej) => {
            this.connection.query(
                'INSERT INTO `auto_survey`.`students_info` VALUES(?,?,?,?,?,?,?)',
                [
                    user.birthday,
                    user.name,
                    user.province,
                    user.schoolType,
                    user.school,
                    user.survey_time_from,
                    user.survey_time_to,
                ],
                (error) => {
                    if(error) rej(error);
                    res();
                }
            )
        })
    }
}