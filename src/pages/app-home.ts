import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {
  static styles = [
    styles,
    css`
    :host {
      display: block;
      min-height: 100vh;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }

    sl-card::part(footer) {
      display: flex;
      justify-content: flex-end;
    }

    @media(min-width: 750px) {
      sl-card {
        width: 100%;
      }
    }

    @media (horizontal-viewport-segments: 2) {
      #welcomeBar {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
      }
    }

    product-display {
      width: 100%;
    }
  `];

  @state() selectedProduct: any;

  async firstUpdated() {
    const search = this.shadowRoot?.querySelector('search-bar');
    if (search) {
      search.addEventListener('product-selected', (event: Event) => {
        const customEvent = event as CustomEvent;
        this.selectedProduct = customEvent.detail?.product;
        console.log('Product selected:', this.selectedProduct);
      });
    }
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'Deal Spion Search',
        text: 'Search deals using heisse-preise.io',
        url: 'https://github.com/pwa-builder/pwa-starter',
      });
    }
  }

  render() {
    return html`
      <app-header></app-header>

      <main>
        <div id="welcomeBar">
          <search-bar></search-bar>
        </div>
        <product-display .product=${this.selectedProduct}></product-display>
      </main>
      <bottom-bar></bottom-bar>
    `;
  }
}