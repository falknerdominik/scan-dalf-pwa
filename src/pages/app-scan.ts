import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import ProductInfo from '../services/online-product-service';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';
  @state() product: ProductInfo | null = null;
  @state() selectedProduct: ProductInfo | null = null;

  lastScannedBarcode: string | null = null;

  static styles = [
    styles,
    css`
    #welcomeBar {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    #welcomeCard,
    #infoCard {
      padding: 18px;
      padding-top: 0px;
    }

    sl-card::part(footer) {
      display: flex;
      justify-content: flex-end;
    }

    @media(min-width: 750px) {
      sl-card {
        width: 70vw;
      }
    }


    @media (horizontal-viewport-segments: 2) {
      #welcomeBar {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }

      #welcomeCard {
        margin-right: 64px;
      }
    }
  `];

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    const videoCapture = this.shadowRoot?.querySelector('video-capture');

    // Listen for the barcode-detected event
    if (videoCapture) {
      videoCapture.addEventListener('barcode-detected', (event: Event) => {
        const customEvent = event as CustomEvent;

        const currentBarcode = customEvent.detail;
        if (this.lastScannedBarcode && currentBarcode === this.lastScannedBarcode) {
          return;
        }

        // new barcode detected
        console.log('Scanned Barcode:', currentBarcode);


        // Store the barcode in a property (or take any other action)
        this.lastScannedBarcode = currentBarcode;
        this.message = `Scanned Barcode: ${currentBarcode}`;
        this.fetchProductInfo(currentBarcode);
      });
    }
  }

  async fetchProductInfo(barcode: string) {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        this.product = {
          product_name: data.product.product_name || 'Unknown Product',
          brands: data.product.brands || 'Unknown Brand',
          image_url: data.product.image_url || '',
          categories_tags: data.product.categories_tags || [],
        };
      } else {
        this.product = null;
        alert('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product info:', error);
      alert('Failed to fetch product information');
    }
  }

  renderProductInfo() {
    if (!this.product) return html`<p>No product scanned yet.</p>`;

    return html`
      <div class="product-info">
        <h2>${this.product.product_name}</h2>
        <p>Brand: ${this.product.brands}</p>
        <p>Categories: ${this.product.categories_tags.join(', ')}</p>
        ${this.product.image_url
          ? html`<img src="${this.product.image_url}" class="product-image" alt="${this.product.product_name}" />`
          : ''}
      </div>
    `;
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'Deal Spion Scanner',
        text: 'Scan products to get more information',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  render() {
    return html`
      <app-header></app-header>

      <main>
        <video-capture></video-capture>
        ${this.renderProductInfo()}
      </main>
    `;
  }
}
