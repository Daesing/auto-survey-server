import { AutoSurveyServer } from './src/server/instance';
import * as jsonreader from './src/util/jsonreader';
import { RestApiServer } from './src/server/restapi';


process.stdout.write('Reading settings file... ');
let settings = jsonreader.readSync('./settings.json');
console.log('✔');

new AutoSurveyServer(settings['database']).start().then(surveyServer => {
    if(settings['rest']['runServer']) {
        process.stdout.write('Starting rest api server... ');
        new RestApiServer(8090, surveyServer).start();
        console.log('✔');
    }
});