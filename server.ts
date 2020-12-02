import { DatabaseConnector } from './src/server/database';
import { AutoSurveyServer } from './src/server/server';

new AutoSurveyServer('db_settings.json').start().then((server) => {
    server.database.registerUser({
        birthday: '041025',
        name: '김민재',
        province: '경기도',
        school: '과천중앙고등학교',
        school_type: '고등학교',
        survey_time: '1240'
    })
});

