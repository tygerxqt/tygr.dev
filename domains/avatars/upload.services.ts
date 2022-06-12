import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../../types/ApiResponse";

export const uploadAvatarRequest = async (
  id: string,
  formData: FormData,
  progressCallback?: (progressEvent: ProgressEvent) => void
): Promise<ApiResponse<string[]>> => {
  const config: AxiosRequestConfig = {
    headers: { "content-type": "multipart/form-data" },
    onUploadProgress: progressCallback,
    validateStatus: (status) => true,
  };
  const response = await axios.post(
    `/api/avatars/upload?id=${id}`,
    formData,
    config
  );

  return response.data;
};
