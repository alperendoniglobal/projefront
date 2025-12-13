/**
 * API Module
 * Tüm API'lerin merkezi export noktası
 */

// Client utilities
export {
  getToken,
  setToken,
  removeToken,
  getFileUrl,
  ApiError,
} from './client';

// API modules
export { authApi } from './auth';
export { 
  projectsApi, 
  type Project, 
  type CreateProjectData, 
  type UpdateProjectData,
  type CreateProjectDto, 
  type UpdateProjectDto 
} from './projects';
export { newsApi, type News, type CreateNewsDto, type UpdateNewsDto } from './news';
export { careersApi, type Career, type CreateCareerDto, type UpdateCareerDto } from './careers';
export { settingsApi, type Settings, type HeroSlide, type SocialMedia, type Stats, type UpdateSettingsDto } from './settings';
export { uploadApi, type UploadResponse, type MultiUploadResponse, type UploadFolder } from './upload';
export { galleryApi, type GalleryItem, type UploadResult } from './gallery';
export { referencesApi, type Reference, type CreateReferenceDto, type UpdateReferenceDto } from './references';

// Health check
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/health`);
  return response.json();
};
