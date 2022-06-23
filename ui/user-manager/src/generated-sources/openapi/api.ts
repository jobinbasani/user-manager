/* tslint:disable */
/* eslint-disable */
/**
 * User Manager API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface Announcement
 */
export interface Announcement {
    /**
     * Announcement ID
     * @type {string}
     * @memberof Announcement
     */
    'id': string;
    /**
     * Date on which this announcement was created
     * @type {string}
     * @memberof Announcement
     */
    'createdOn': string;
    /**
     * Announcement title
     * @type {string}
     * @memberof Announcement
     */
    'title': string;
    /**
     * Announcement subtitle
     * @type {string}
     * @memberof Announcement
     */
    'subtitle'?: string;
    /**
     * Announcement details
     * @type {string}
     * @memberof Announcement
     */
    'description': string;
    /**
     * Day on which this announcement expires
     * @type {string}
     * @memberof Announcement
     */
    'expiresOn'?: string;
}
/**
 * 
 * @export
 * @interface AnnouncementId
 */
export interface AnnouncementId {
    /**
     * 
     * @type {string}
     * @memberof AnnouncementId
     */
    'id': string;
}
/**
 * The specified content was not found.
 * @export
 * @interface BadRequestError
 */
export interface BadRequestError {
    /**
     * 
     * @type {string}
     * @memberof BadRequestError
     */
    'message': string;
    /**
     * 
     * @type {number}
     * @memberof BadRequestError
     */
    'code': number;
    /**
     * 
     * @type {Array<InternalServerErrorErrors>}
     * @memberof BadRequestError
     */
    'errors'?: Array<InternalServerErrorErrors>;
}
/**
 * 
 * @export
 * @interface FamilyId
 */
export interface FamilyId {
    /**
     * 
     * @type {string}
     * @memberof FamilyId
     */
    'familyId'?: string;
}
/**
 * User does not have the appropriate permissions to access this endpoint.
 * @export
 * @interface ForbiddenError
 */
export interface ForbiddenError {
    /**
     * 
     * @type {string}
     * @memberof ForbiddenError
     */
    'message': string;
    /**
     * 
     * @type {number}
     * @memberof ForbiddenError
     */
    'code': number;
    /**
     * 
     * @type {Array<InternalServerErrorErrors>}
     * @memberof ForbiddenError
     */
    'errors'?: Array<InternalServerErrorErrors>;
}
/**
 * Unhandled internal server error has occurred.
 * @export
 * @interface InternalServerError
 */
export interface InternalServerError {
    /**
     * 
     * @type {string}
     * @memberof InternalServerError
     */
    'message': string;
    /**
     * 
     * @type {number}
     * @memberof InternalServerError
     */
    'code': number;
    /**
     * 
     * @type {Array<InternalServerErrorErrors>}
     * @memberof InternalServerError
     */
    'errors'?: Array<InternalServerErrorErrors>;
}
/**
 * 
 * @export
 * @interface InternalServerErrorErrors
 */
export interface InternalServerErrorErrors {
    /**
     * 
     * @type {number}
     * @memberof InternalServerErrorErrors
     */
    'code': number;
    /**
     * 
     * @type {string}
     * @memberof InternalServerErrorErrors
     */
    'field': string;
    /**
     * 
     * @type {string}
     * @memberof InternalServerErrorErrors
     */
    'message': string;
}
/**
 * The specified content was not found.
 * @export
 * @interface NotFoundError
 */
export interface NotFoundError {
    /**
     * 
     * @type {string}
     * @memberof NotFoundError
     */
    'message': string;
    /**
     * 
     * @type {number}
     * @memberof NotFoundError
     */
    'code': number;
    /**
     * 
     * @type {Array<InternalServerErrorErrors>}
     * @memberof NotFoundError
     */
    'errors'?: Array<InternalServerErrorErrors>;
}
/**
 * User must be authenticated in order to access this endpoint.
 * @export
 * @interface UnauthorizedError
 */
export interface UnauthorizedError {
    /**
     * 
     * @type {string}
     * @memberof UnauthorizedError
     */
    'message': string;
    /**
     * 
     * @type {number}
     * @memberof UnauthorizedError
     */
    'code': number;
    /**
     * 
     * @type {Array<InternalServerErrorErrors>}
     * @memberof UnauthorizedError
     */
    'errors'?: Array<InternalServerErrorErrors>;
}
/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * A unique identifier
     * @type {string}
     * @memberof User
     */
    'id': string;
    /**
     * Display name of the user
     * @type {string}
     * @memberof User
     */
    'displayName': string;
    /**
     * First name
     * @type {string}
     * @memberof User
     */
    'firstName': string;
    /**
     * First name
     * @type {string}
     * @memberof User
     */
    'lastName'?: string;
    /**
     * Email ID of user
     * @type {string}
     * @memberof User
     */
    'email': string;
    /**
     * Indicates whether the user is approved in the system
     * @type {boolean}
     * @memberof User
     */
    'isApproved'?: boolean;
}
/**
 * 
 * @export
 * @interface UserData
 */
export interface UserData {
    /**
     * A unique identifier
     * @type {string}
     * @memberof UserData
     */
    'id'?: string;
    /**
     * Family ID to which user belongs to
     * @type {string}
     * @memberof UserData
     */
    'familyId'?: string;
    /**
     * Display name of the user
     * @type {string}
     * @memberof UserData
     */
    'displayName'?: string;
    /**
     * First name
     * @type {string}
     * @memberof UserData
     */
    'firstName': string;
    /**
     * Middle name
     * @type {string}
     * @memberof UserData
     */
    'middleName'?: string;
    /**
     * First name
     * @type {string}
     * @memberof UserData
     */
    'lastName': string;
    /**
     * Baptismal Name
     * @type {string}
     * @memberof UserData
     */
    'baptismalName'?: string;
    /**
     * House name
     * @type {string}
     * @memberof UserData
     */
    'houseName'?: string;
    /**
     * Family unit
     * @type {string}
     * @memberof UserData
     */
    'familyUnit'?: string;
    /**
     * Date of birth
     * @type {string}
     * @memberof UserData
     */
    'dateOfBirth': string;
    /**
     * Date of baptism
     * @type {string}
     * @memberof UserData
     */
    'dateOfBaptism'?: string;
    /**
     * Date of confirmation
     * @type {string}
     * @memberof UserData
     */
    'dateOfConfirmation'?: string;
    /**
     * Home parish
     * @type {string}
     * @memberof UserData
     */
    'homeParish'?: string;
    /**
     * Diocese in India
     * @type {string}
     * @memberof UserData
     */
    'dioceseInIndia'?: string;
    /**
     * Previous Parish in Canada
     * @type {string}
     * @memberof UserData
     */
    'previousParishInCanada'?: string;
    /**
     * Email ID of user
     * @type {string}
     * @memberof UserData
     */
    'email': string;
    /**
     * Indicates primary user
     * @type {boolean}
     * @memberof UserData
     */
    'isPrimary'?: boolean;
    /**
     * Gender
     * @type {string}
     * @memberof UserData
     */
    'gender': UserDataGenderEnum;
    /**
     * 
     * @type {string}
     * @memberof UserData
     */
    'relation'?: UserDataRelationEnum;
    /**
     * 
     * @type {string}
     * @memberof UserData
     */
    'maritalStatus'?: UserDataMaritalStatusEnum;
    /**
     * Apartment Number
     * @type {string}
     * @memberof UserData
     */
    'apartment'?: string;
    /**
     * Street number and name
     * @type {string}
     * @memberof UserData
     */
    'street'?: string;
    /**
     * City
     * @type {string}
     * @memberof UserData
     */
    'city'?: string;
    /**
     * Status in Canada
     * @type {string}
     * @memberof UserData
     */
    'canadianStatus'?: UserDataCanadianStatusEnum;
    /**
     * In Canada since
     * @type {string}
     * @memberof UserData
     */
    'inCanadaSince'?: string;
    /**
     * Province
     * @type {string}
     * @memberof UserData
     */
    'province'?: UserDataProvinceEnum;
    /**
     * Postal Code
     * @type {string}
     * @memberof UserData
     */
    'postalCode'?: string;
    /**
     * Mobile number
     * @type {string}
     * @memberof UserData
     */
    'mobile'?: string;
}

export const UserDataGenderEnum = {
    Male: 'male',
    Female: 'female'
} as const;

export type UserDataGenderEnum = typeof UserDataGenderEnum[keyof typeof UserDataGenderEnum];
export const UserDataRelationEnum = {
    Spouse: 'spouse',
    Child: 'child',
    Parent: 'parent',
    GrandParent: 'grandParent',
    Sibling: 'sibling',
    Other: 'other'
} as const;

export type UserDataRelationEnum = typeof UserDataRelationEnum[keyof typeof UserDataRelationEnum];
export const UserDataMaritalStatusEnum = {
    Single: 'single',
    Married: 'married',
    Widowed: 'widowed',
    Separated: 'separated',
    Divorced: 'divorced'
} as const;

export type UserDataMaritalStatusEnum = typeof UserDataMaritalStatusEnum[keyof typeof UserDataMaritalStatusEnum];
export const UserDataCanadianStatusEnum = {
    Citizen: 'citizen',
    PermanentResident: 'permanentResident',
    Visitor: 'visitor',
    Student: 'student',
    WorkPermit: 'workPermit'
} as const;

export type UserDataCanadianStatusEnum = typeof UserDataCanadianStatusEnum[keyof typeof UserDataCanadianStatusEnum];
export const UserDataProvinceEnum = {
    Ab: 'AB',
    Bc: 'BC',
    Mb: 'MB',
    Nb: 'NB',
    Nl: 'NL',
    Nt: 'NT',
    Ns: 'NS',
    Nu: 'NU',
    On: 'ON',
    Pe: 'PE',
    Qc: 'QC',
    Sk: 'SK',
    Yt: 'YT'
} as const;

export type UserDataProvinceEnum = typeof UserDataProvinceEnum[keyof typeof UserDataProvinceEnum];


/**
 * AdminApi - axios parameter creator
 * @export
 */
export const AdminApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Add a new announcement
         * @param {Announcement} announcement Announcement details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addAnnouncement: async (announcement: Announcement, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'announcement' is not null or undefined
            assertParamExists('addAnnouncement', 'announcement', announcement)
            const localVarPath = `/api/v1/admin/announcements`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(announcement, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Delete announcements
         * @param {Array<string>} requestBody Announcement id\&#39;s to delete
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteAnnouncements: async (requestBody: Array<string>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'requestBody' is not null or undefined
            assertParamExists('deleteAnnouncements', 'requestBody', requestBody)
            const localVarPath = `/api/v1/admin/announcements`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(requestBody, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AdminApi - functional programming interface
 * @export
 */
export const AdminApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AdminApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Add a new announcement
         * @param {Announcement} announcement Announcement details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addAnnouncement(announcement: Announcement, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AnnouncementId>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addAnnouncement(announcement, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Delete announcements
         * @param {Array<string>} requestBody Announcement id\&#39;s to delete
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteAnnouncements(requestBody: Array<string>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteAnnouncements(requestBody, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * AdminApi - factory interface
 * @export
 */
export const AdminApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AdminApiFp(configuration)
    return {
        /**
         * 
         * @summary Add a new announcement
         * @param {Announcement} announcement Announcement details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addAnnouncement(announcement: Announcement, options?: any): AxiosPromise<AnnouncementId> {
            return localVarFp.addAnnouncement(announcement, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Delete announcements
         * @param {Array<string>} requestBody Announcement id\&#39;s to delete
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteAnnouncements(requestBody: Array<string>, options?: any): AxiosPromise<Array<string>> {
            return localVarFp.deleteAnnouncements(requestBody, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AdminApi - object-oriented interface
 * @export
 * @class AdminApi
 * @extends {BaseAPI}
 */
export class AdminApi extends BaseAPI {
    /**
     * 
     * @summary Add a new announcement
     * @param {Announcement} announcement Announcement details
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AdminApi
     */
    public addAnnouncement(announcement: Announcement, options?: AxiosRequestConfig) {
        return AdminApiFp(this.configuration).addAnnouncement(announcement, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Delete announcements
     * @param {Array<string>} requestBody Announcement id\&#39;s to delete
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AdminApi
     */
    public deleteAnnouncements(requestBody: Array<string>, options?: AxiosRequestConfig) {
        return AdminApiFp(this.configuration).deleteAnnouncements(requestBody, options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * FamilyManagementApi - axios parameter creator
 * @export
 */
export const FamilyManagementApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Add family members
         * @param {Array<UserData>} userData Array of family members
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addFamilyMembers: async (userData: Array<UserData>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userData' is not null or undefined
            assertParamExists('addFamilyMembers', 'userData', userData)
            const localVarPath = `/api/v1/user/family`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(userData, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Delete family members
         * @param {Array<string>} requestBody Array of family member id\&#39;s
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteFamilyMembers: async (requestBody: Array<string>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'requestBody' is not null or undefined
            assertParamExists('deleteFamilyMembers', 'requestBody', requestBody)
            const localVarPath = `/api/v1/user/family`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(requestBody, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get user family details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserFamily: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/user/family`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * FamilyManagementApi - functional programming interface
 * @export
 */
export const FamilyManagementApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = FamilyManagementApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Add family members
         * @param {Array<UserData>} userData Array of family members
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async addFamilyMembers(userData: Array<UserData>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<FamilyId>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.addFamilyMembers(userData, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Delete family members
         * @param {Array<string>} requestBody Array of family member id\&#39;s
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteFamilyMembers(requestBody: Array<string>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteFamilyMembers(requestBody, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @summary Get user family details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserFamily(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<UserData>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUserFamily(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * FamilyManagementApi - factory interface
 * @export
 */
export const FamilyManagementApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = FamilyManagementApiFp(configuration)
    return {
        /**
         * 
         * @summary Add family members
         * @param {Array<UserData>} userData Array of family members
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addFamilyMembers(userData: Array<UserData>, options?: any): AxiosPromise<FamilyId> {
            return localVarFp.addFamilyMembers(userData, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Delete family members
         * @param {Array<string>} requestBody Array of family member id\&#39;s
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteFamilyMembers(requestBody: Array<string>, options?: any): AxiosPromise<Array<string>> {
            return localVarFp.deleteFamilyMembers(requestBody, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get user family details
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserFamily(options?: any): AxiosPromise<Array<UserData>> {
            return localVarFp.getUserFamily(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * FamilyManagementApi - object-oriented interface
 * @export
 * @class FamilyManagementApi
 * @extends {BaseAPI}
 */
export class FamilyManagementApi extends BaseAPI {
    /**
     * 
     * @summary Add family members
     * @param {Array<UserData>} userData Array of family members
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FamilyManagementApi
     */
    public addFamilyMembers(userData: Array<UserData>, options?: AxiosRequestConfig) {
        return FamilyManagementApiFp(this.configuration).addFamilyMembers(userData, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Delete family members
     * @param {Array<string>} requestBody Array of family member id\&#39;s
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FamilyManagementApi
     */
    public deleteFamilyMembers(requestBody: Array<string>, options?: AxiosRequestConfig) {
        return FamilyManagementApiFp(this.configuration).deleteFamilyMembers(requestBody, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get user family details
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FamilyManagementApi
     */
    public getUserFamily(options?: AxiosRequestConfig) {
        return FamilyManagementApiFp(this.configuration).getUserFamily(options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * PublicApi - axios parameter creator
 * @export
 */
export const PublicApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get all announcements
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAnnouncements: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/public/announcements`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PublicApi - functional programming interface
 * @export
 */
export const PublicApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PublicApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get all announcements
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAnnouncements(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Announcement>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAnnouncements(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * PublicApi - factory interface
 * @export
 */
export const PublicApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PublicApiFp(configuration)
    return {
        /**
         * 
         * @summary Get all announcements
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAnnouncements(options?: any): AxiosPromise<Array<Announcement>> {
            return localVarFp.getAnnouncements(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PublicApi - object-oriented interface
 * @export
 * @class PublicApi
 * @extends {BaseAPI}
 */
export class PublicApi extends BaseAPI {
    /**
     * 
     * @summary Get all announcements
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PublicApi
     */
    public getAnnouncements(options?: AxiosRequestConfig) {
        return PublicApiFp(this.configuration).getAnnouncements(options).then((request) => request(this.axios, this.basePath));
    }
}


/**
 * UserManagementApi - axios parameter creator
 * @export
 */
export const UserManagementApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Provides user profile information
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUser: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/user/profile`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserManagementApi - functional programming interface
 * @export
 */
export const UserManagementApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserManagementApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Provides user profile information
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUser(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUser(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * UserManagementApi - factory interface
 * @export
 */
export const UserManagementApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserManagementApiFp(configuration)
    return {
        /**
         * 
         * @summary Provides user profile information
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUser(options?: any): AxiosPromise<User> {
            return localVarFp.getUser(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserManagementApi - object-oriented interface
 * @export
 * @class UserManagementApi
 * @extends {BaseAPI}
 */
export class UserManagementApi extends BaseAPI {
    /**
     * 
     * @summary Provides user profile information
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserManagementApi
     */
    public getUser(options?: AxiosRequestConfig) {
        return UserManagementApiFp(this.configuration).getUser(options).then((request) => request(this.axios, this.basePath));
    }
}


