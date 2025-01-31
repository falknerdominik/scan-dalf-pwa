interface ProductInfo {
  product_name: string;
  brands: string;
  image_url: string;
  categories_tags: string[];
}

export interface ProductServiceInterface {
    fetchProductInfo(barcode: string): Promise<ProductInfo | null>;
  }

  export class OnlineProductService implements ProductServiceInterface {
    private readonly API_URL = 'https://world.openfoodfacts.org/api/v2/product/';

    async fetchProductInfo(barcode: string): Promise<ProductInfo | null> {
      const url = `${this.API_URL}${barcode}.json`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 1 && data.product) {
          return {
            product_name: data.product.product_name || 'Unknown Product',
            brands: data.product.brands || 'Unknown Brand',
            image_url: data.product.image_url || '',
            categories_tags: data.product.categories_tags || [],
          };
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error fetching product info:', error);
        return null;
      }
    }
  }

  export default ProductInfo;