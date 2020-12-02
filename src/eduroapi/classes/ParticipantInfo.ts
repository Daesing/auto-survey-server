import * as constant from '../constant';
import { EduroSurveyApi, SurveyResult } from '../api';

export class ParticipantInfo {
    atptOfcdcConctUrl: string;
    lctnScCode: string;
    orgCode: string;
    orgName: string;
    schulCrseScCode: string;
    stdntYn: string;
    token: string;
    userNameEncpt: string;
    userPNo: string;
    wrongPassCnt: number;
    admnYn: string;
    deviceUuid: string;
    insttClsfCode: string;
    isHealthy: boolean;
    lockYn: string;
    mngrClassYn: string;
    mngrDeptYn: string;
    pInfAgrmYn: string;
    registerDtm: string;
    registerYmd: string;
    upperUserName: string;
    userName: string;

    constructor(obj: ParticipantInfo) {
        this.atptOfcdcConctUrl = obj.atptOfcdcConctUrl;
        this.lctnScCode = obj.lctnScCode;
        this.orgCode = obj.orgCode;
        this.orgName = obj.orgName;
        this.schulCrseScCode = obj.schulCrseScCode;
        this.stdntYn = obj.stdntYn;
        this.token = obj.token;
        this.userNameEncpt = obj.userNameEncpt;
        this.userPNo = obj.userPNo;
        this.wrongPassCnt = obj.wrongPassCnt;
        this.admnYn = obj.admnYn;
        this.deviceUuid = obj.deviceUuid;
        this.insttClsfCode = obj.insttClsfCode;
        this.isHealthy = obj.isHealthy;
        this.lockYn = obj.lockYn;
        this.mngrClassYn = obj.mngrClassYn;
        this.mngrDeptYn = obj.mngrDeptYn;
        this.pInfAgrmYn = obj.pInfAgrmYn;
        this.registerDtm = obj.registerDtm;
        this.registerYmd = obj.registerYmd;
        this.upperUserName = obj.upperUserName;
        this.userName = obj.userName;
    }

    async doSurvey(): Promise<SurveyResult> {
        return new SurveyResult(await EduroSurveyApi.fetch('post', '/registerServey', this.token, constant.getSurvey(this.token, this.userName)));
    }
}
