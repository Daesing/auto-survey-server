import express from 'express';
import { AutoSurveyServer } from './instance';

export class RestApiServer {

    private port : number;
    private parentServer : AutoSurveyServer;

    constructor(port: number, parentServer: AutoSurveyServer) {
        this.port = port;
        this.parentServer = parentServer;
    }

    async start() {
        return new Promise<void>((res, rej) => {
            const app = express();

            app.get('/addUser', async (request, response) => {
                const parameters = request.query;
                if(!parameters['name'] || !parameters['birthday'] || !parameters['province'] || !parameters['school_type']
                    || !parameters['school'] || !parameters['survey_time'])
                {
                    response.json({error: '빠진 매개변수가 있습니다.'});
                    return;
                }
                
                try {
                    await this.parentServer.database.registerUser({
                        birthday: parameters['birthday'] as string,
                        name: parameters['name'] as string,
                        province: parameters['province'] as string,
                        school_type: parameters['school_type'] as string,
                        school: parameters['school'] as string,
                        survey_time: parameters['survey_time'] as string,
                    });
                    response.json({result: 'success'});
                } catch(e) {
                    response.json({error: e});
                }
            })
    
            app.listen(this.port, () => {
                res();
            })
        })
    }
    
}