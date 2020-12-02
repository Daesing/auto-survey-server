import { DatabaseConnector } from './src/server/database';
import { AutoSurveyServer } from './src/server/server';

new AutoSurveyServer('db_settings.json').start();

