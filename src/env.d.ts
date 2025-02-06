declare interface Env {
  readonly NODE_ENV: string;
 readonly NG_APP_PROJECTID:string;
  readonly NG_APP_APPID:string;
  readonly NG_APP_STORAGE_BUCKET:string;
  readonly NG_APP_LOCATIONID:string;
  readonly NG_APP_API_KEY:string;
  readonly NG_APP_AUTH_DOMAIN:string;
  readonly NG_APP_MESSAGING_SENDER_ID:string;
}
declare interface ImportMeta {
  readonly env: Env;
}