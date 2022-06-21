import {
  AdminApi,
  Configuration, FamilyManagementApi, PublicApi, UserManagementApi,
} from '../generated-sources/openapi';
import { API_URL } from '../constants/ApiConstants';

function getApiConfig(accessToken:string):Configuration {
  return new Configuration({
    basePath: API_URL,
    accessToken,
  });
}

export function getFamilyManagementAPI(accessToken:string):FamilyManagementApi {
  return new FamilyManagementApi(getApiConfig(accessToken));
}

export function getUserManagementAPI(accessToken:string):UserManagementApi {
  return new UserManagementApi(getApiConfig(accessToken));
}

export function getAdminAPI(accessToken:string):AdminApi {
  return new AdminApi(getApiConfig(accessToken));
}

export function getPublicAPI():PublicApi {
  return new PublicApi(getApiConfig(''));
}
