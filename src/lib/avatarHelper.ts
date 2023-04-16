import config from '../config';
export function getAvatar50(userId: string, avatar: string): string {
	return `${config.apiUrl}/api/files/users/${userId}/${avatar}?thumb=50x50`;
}

export function getAvatar80(userId: string, avatar: string): string {
	return `${config.apiUrl}/api/files/users/${userId}/${avatar}?thumb=80x80`;
}

export function getAvatar100(userId: string, avatar: string): string {
	return `${config.apiUrl}/api/files/users/${userId}/${avatar}?thumb=100x100`;
}

export function getAvatar300(userId: string, avatar: string): string {
	return `${config.apiUrl}/api/files/users/${userId}/${avatar}?thumb=300x300`;
}
