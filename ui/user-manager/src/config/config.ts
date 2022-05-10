

export interface ConfigType {
    userIdPool: string;
    userPoolClientId: string;
    region: string;
}

/**
 * AWS Amplify config / Cognito
 */
export const AuthConfig: ConfigType  = {
    userIdPool: "",
    userPoolClientId: "",
    region: ""
}