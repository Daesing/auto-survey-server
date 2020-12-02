import { EduroSurveyApi } from '../api';
import { ParticipantInfo } from "./ParticipantInfo";

export class ParticipantPreview {
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
    mngrYn: string;
    otherYn: string;

    constructor(obj: ParticipantPreview) {
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
        this.mngrYn = obj.mngrYn;
        this.otherYn = obj.otherYn;
    }

    async getParticipantInfo(): Promise<ParticipantInfo> {
        return new ParticipantInfo(await EduroSurveyApi.fetch('post', '/v2/getUserInfo', this.token, {
            orgCode: this.orgCode,
            userPNo: this.userPNo
        }));
    }
}
