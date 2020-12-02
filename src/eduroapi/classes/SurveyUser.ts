import { EduroSurveyApi, encryptor } from '../api';
import { ParticipantPreview } from "./ParticipantPreview";

export class SurveyUser {
    orgName: string;
    admnYn: string;
    atptOfcdcConctUrl: string;
    mngrClassYn: string;
    pInfAgrmYn: string;
    userName: string;
    stdntYn: string;
    token: string;
    mngrDeptYn: string;

    constructor(obj: SurveyUser) {
        this.orgName = obj.orgName;
        this.admnYn = obj.admnYn;
        this.atptOfcdcConctUrl = obj.atptOfcdcConctUrl;
        this.mngrClassYn = obj.mngrClassYn;
        this.pInfAgrmYn = obj.pInfAgrmYn;
        this.userName = obj.userName;
        this.stdntYn = obj.stdntYn;
        this.token = obj.token;
        this.mngrDeptYn = obj.mngrDeptYn;
    }

    async hasPassword(): Promise<boolean> {
        return await EduroSurveyApi.fetch('post', '/v2/hasPassword', this.token, {});
    }

    async validatePassword(password: string): Promise<boolean> {
        return await EduroSurveyApi.fetch('post', '/v2/hasPassword', this.token, {
            deviceUuid: '',
            password: encryptor.encrypt(password)
        });
    }

    async getParticipantPreviews(): Promise<ParticipantPreview[]> {
        return (<Array<any>>await EduroSurveyApi.fetch('post', '/v2/selectUserGroup', this.token, {}))
            .map(prev => new ParticipantPreview(prev));
    }
}
