import { AutoSurveyServer } from './src/server/instance';
import * as jsonreader from './src/util/jsonreader';

process.stdout.write('Reading settings file... ');
let settings = jsonreader.readSync('./settings.json');
console.log('✔');

new AutoSurveyServer(settings['database']).start();

