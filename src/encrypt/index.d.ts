interface JsEncryptOptions {
    default_key_size?: number;
    default_public_exponent?: string;
    log?: boolean;
}

type DigestMethod = (string : string) => any;
type CallBack = () => any;

export class JsEncrypt {
    static version : string;

    constructor(options?: string);
    setKey(key: Object | string) : JsEncryptRSAKey;
    setPrivateKey(key: Object | string) : JsEncryptRSAKey;
    setPublicKey(key: Object | string) : JsEncryptRSAKey;
    decrypt(str: string) : string;
    encrypt(str: string) : string;
    sign(str: string, digestMethod: DigestMethod, digestName: string) : string;
    verify(str: string, signature: string, digestMethod: DigestMethod) : boolean;
    getKey(cb: CallBack) : JsEncryptRSAKey;
    getPrivateKey() : string;
    getPrivateKeyB64() : string;
    getPublicKey() : string;
    getPublicKeyB64() : string;
}

export class JsEncryptRSAKey extends RSAKey {
    constructor(key: string | Object);
    parseKey(pem: string) : boolean;
    getPrivateBaseKey() : string;
    getPrivateBaseKeyB64() : string;
    getPublicBaseKey() : string;
    getPublicBaseKeyB64() : string;
    wordwrap(str: string, width?: number) : string;
    getPrivateKey() : string;
    getPublicKey() : string;
    hasPublicKeyProperty() : boolean;

    static hasPrivateKeyProperty(obj: any) : boolean;
    static parsePropertiesFrom(obj: any) : boolean;
    parsePropertiesFrom(obj: any) : void;
}

export class BigInteger {}

export class RSAKey {
    doPublic(x: BigInteger) : BigInteger;
    doPrivate(x: BigInteger) : BigInteger;
    setPublic(N: string, E: string) : void;
    encrypt(text: string) : string;
    setPrivate(N: string, E: string, D: string) : void;
    setPrivateEx(N: string, E: string, D: string, P: string, Q: string, DP: string, DQ: string, C: string) : void;
    generate(B: number, E: string) : void;
    decrypt(ctext: string) : string;
    generateAsync(B: number, E: string, callback: CallBack) : void;
    sign(text: string, digestMethod: DigestMethod, digestName: string) : string;
    verify(text: string, signature: string, digestMethod: DigestMethod) : boolean;
}