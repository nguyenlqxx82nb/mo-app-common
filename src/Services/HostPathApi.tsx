import AppConfig from '../AppConfig';
import Storage from '../Storage';
import StorageKeys from '../Storage/keys';

export const DOMAIN_GET_SOURCES_STATIC = async () => {
	return `${AppConfig.DomainGetSourcesStatic}/static/`;
};

export const HOST_ADM = async () => {
	return `${AppConfig.Domain}adm/api/v2.1/`;
};

export const PATH_SOCIAL = async () => {
	const path = await Storage.getItem(StorageKeys.PathSocial);
	return `${path || AppConfig.Domain}social/`;
};

export const HOST_SOCIAL = async () => {
	const path = await PATH_SOCIAL();
	return `${path || AppConfig.Domain}api/v1.0/`;
};

export const HOST_CHAT_TOOL = async () => {
	const path = await Storage.getItem(StorageKeys.PathChattool);
	return `${path || AppConfig.Domain}chattool/api/v2.0/`;
};

export const HOST_PROFILING = async () => {
	const path = await Storage.getItem(StorageKeys.PathProfiling);
	return `${path || AppConfig.Domain}profiling/v3.0/`;
};

export const HOST_CALL_CENTER = async () => {
	const path = await Storage.getItem(StorageKeys.PathCallCenter);
	return `${path || AppConfig.Domain}callcenter/api/v2.0/`;
};

export const HOST_EVENT = async () => {
	const path = await Storage.getItem(StorageKeys.PathEvent);
	return `${path || AppConfig.DomainProfiling}events/api/v1.0/`;
};

export const HOST_FACEBOOK = () => {
	return `https://graph.facebook.com/v3.1/`;
};

export const HOST_YOUTUBE = () => {
	return `https://www.googleapis.com/youtube/v3/`;
};

export const HOST_STRINGEE = () => {
    return `https://icc-api.stringee.com/v1/`;
};

