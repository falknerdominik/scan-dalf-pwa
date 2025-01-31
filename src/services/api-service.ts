import axios from "axios";

class APIService {
  private apiUrl: string;
  private apiToken: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.apiToken = import.meta.env.API_TOKEN; // Load token from environment variables
  }

  /**
   * Uploads a product with optional image.
   * @param barcode - The barcode value.
   * @param id - The heisse_preise_id value.
   * @param image - (Optional) The image file to upload.
   */
  async uploadProduct(barcode: string, id: string, image?: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("barcode", barcode);
      formData.append("heisse_preise_id", id);

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${this.apiUrl}/api/collections/abcd/records`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.apiToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error in product upload: ${error}`);
    }
  }
}

// Example usage:
const apiService = new APIService("https://kleio.fly.dev");

// Upload product without image
apiService
  .uploadProduct("testBarcode", "testId")
  .then((response) => console.log("Response without image:", response))
  .catch((error) => console.error("Error without image:", error));

// Upload product with image
const imageFile = new File(["content"], "image.jpg", { type: "image/jpeg" });
apiService
  .uploadProduct("testBarcode", "testId", imageFile)
  .then((response) => console.log("Response with image:", response))
  .catch((error) => console.error("Error with image:", error));
