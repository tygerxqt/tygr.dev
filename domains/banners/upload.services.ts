import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../../types/ApiResponse";

export const uploadBannerRequest = async (
    id: string,
    token: string,
    formData: FormData,
    progressCallback?: (progressEvent: ProgressEvent) => void
): Promise<ApiResponse<string[]>> => {
    const config: AxiosRequestConfig = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: progressCallback,
        validateStatus: (status) => true,
    };
    const response = await axios.post(
        `/api/banners/upload?id=${id}&token=${token}`,
        formData,
        config
    );

    return response.data;
};
