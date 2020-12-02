import fetch from 'node-fetch';
import { JsEncrypt } from '../encrypt'
import * as constant from './constant'
import { SchoolSearchResult } from './classes/SchoolSearchResult';
import { SurveyUser } from './classes/SurveyUser';

export const encryptor = new JsEncrypt();
encryptor.setPublicKey(constant.rsaKey);



type SurveyLoginType = 'school';
type HttpMethod = 'get' | 'post';



export interface LoginInfo {
    orgCode: string;
    birthday: string;
    name: string;
    loginType: SurveyLoginType;
    stdntPNo?: string;
}




export class EduroSurveyApi {
    
    private static url = 'https://goehcs.eduro.go.kr';

    static async fetch(method: HttpMethod, dir: string, auth: string, body?: any) : Promise<any> {
        let response = await fetch(EduroSurveyApi.url + dir, {
            method: method,
            headers: {
                'Content-Type': body ? 'application/json' : undefined,
                'Authorization': auth
            },
            body: JSON.stringify(body)
        });

        if(response.status !== 200) throw response.status;
        
        let data = await response.json();
        return data;
    }

    static async findUser(loginInfo: LoginInfo) : Promise<SurveyUser> {
        return new SurveyUser(await EduroSurveyApi.fetch('post', '/v2/findUser', undefined, {
            birthday: encryptor.encrypt(loginInfo.birthday),
            name: encryptor.encrypt(loginInfo.name),
            orgCode: loginInfo.orgCode,
            loginType: loginInfo.loginType,
            stdntPNo: loginInfo.stdntPNo
        }));
    }

    static async searchSchool(provinceName: string, schoolType: string, name: string) : Promise<SchoolSearchResult> {
        if(!constant.provinces.hasOwnProperty(provinceName)) {
            throw `"${provinceName}" (이)라는 행정 구역이 존재하지 않습니다.`
        }
        if(!constant.schoolType.hasOwnProperty(schoolType)) {
            throw `"${schoolType}" (이)라는 학교급이 존재하지 않습니다. (가능한 학교급들: [유치원, 초등학교, 중학교, 고등학교, 특수학교])`
        }
        return await EduroSurveyApi.fetch('get',
            `/v2/searchSchool?` +
                `lctnScCode=${constant.provinces[provinceName]}&` +
                `schulCrseScCode=${constant.schoolType[schoolType]}&` +
                `orgName=${encodeURI(name)}&` +
                `loginType=school`,
            undefined
        );
    }
}



export class SurveyResult {
    registerDtm: Date;
    inveYmd: Date;
    
    constructor(obj: SurveyResult) {
        this.registerDtm = new Date(obj.registerDtm);
        this.inveYmd = new Date(obj.inveYmd);
    }
}