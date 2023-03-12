import config from '../config'
export default function getAvatarPath(userId: string, avatarId: string): string {
    return `${config.apiUrl}/api/files/users/${userId}/${avatarId}?thumb=50x50`;
  }