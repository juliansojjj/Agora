
export interface FirebaseAuthUser{
    "uid": string,
    "email": string,
    "emailVerified": boolean,
    "isAnonymous": boolean,
    "providerData": [
        {
            "providerId": string,
            "uid": string,
            "displayName"?: string,
            "email"?: string,
            "phoneNumber"?: string,
            "photoURL"?: string
        }
    ],
    "stsTokenManager": {
        "refreshToken": string,
        "accessToken": string,
        "expirationTime": number
    },
    "createdAt": string,
    "lastLoginAt": string,
    "apiKey": string,
    "appName": string
}

    export interface FirebaseAuthSignUser{
    _tokenResponse: {isNewUser:boolean}
    operationType: string
    providerId: string
    user: {displayName:string,email:string,uid:string}
    }


export interface FirestoreCollectionUser {
    username:string
    email:string
    providerId:'none'|'google.com'|'apple.com'
    subscription?:boolean
    favorites?:string[];
    uid?:string;
}