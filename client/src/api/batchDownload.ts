import api from "../config/api";

/**
 * Download multiple files from S3 as a ZIP archive
 * 
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Promise that resolves when download is complete
 */
export const downloadFilesAsZip = async (startDate: string, endDate: string): Promise<void> => {
    try {
        // Show loading state in the UI
        const response = await api.get(`/files/batch-download`, {
            params: {
                start_date: startDate,
                end_date: endDate,
            },
            responseType: "blob",
        });

        // Create a unique filename for the ZIP archive
        const zipFileName = `${startDate}_to_${endDate}.zip`;

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", zipFileName);
        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        return Promise.resolve();
    } catch (error) {
        console.error("Error downloading files as ZIP:", error);
        return Promise.reject(error);
    }
};