import { apiClient } from "../lib/axios/apiClient";

export const downloadInvoicePDF = async (orderId: string) => {
  try {
    const response = await apiClient.get(`/order/${orderId}/invoice`, {
      responseType: "blob", 
      headers: {
        "Accept": "application/pdf",
      },
    });

    // Create blob link to download
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    
    const contentDisposition = response.headers["content-disposition"];
    let filename = `invoice-${orderId}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute("download", filename);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
    
  } catch (error: any) {
    console.error("Invoice download error:", error);
    
    // Axios error handling for better debugging
    if (error.response?.status === 404) {
      throw new Error("Invoice not found for this order");
    }
    if (error.response?.status === 401) {
      throw new Error("Please login again to download invoice");
    }
    
    throw new Error(error.response?.data?.message || "Failed to download invoice");
  }
};