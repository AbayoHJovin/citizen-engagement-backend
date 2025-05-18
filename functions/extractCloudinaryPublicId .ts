export const extractCloudinaryPublicId = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const fileName = parts.pop()?.split('.')[0];
    const folder = parts[parts.length - 1];
    return `complaint_images/${fileName}`;
  } catch (e) {
    return null;
  }
};
