
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


export interface FirestoreCollectionUser {
    username:string
    email:string
    subscription:boolean
    favorites?:string[];
}