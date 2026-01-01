export const getDefaultAvatar = (userId: string): string => {
  // Use last 2 hex characters of MongoDB ObjectId
  const hash = parseInt(userId.slice(-2), 16);

  // Round-robin across 10 avatars
  const index = hash % 10;

  return `/avatars/avatar-${index}.jpg`;
};
