import { LitElement, html, css } from 'lit';
import Fuse from 'fuse.js';
import { customElement } from 'lit/decorators.js';

interface Product {
    store: string;
    name: string;
}

@customElement('search-bar')
export class ProductSearch extends LitElement {
    products: Product[] = [];
    searchTerm: string = '';
    filteredProducts: Product[] = [];
    selectedProduct: Product | null = null;
    fuse: Fuse<Product>;
    private searchTimeout: number | null = null;

    static properties = {
      products: { type: Array },
      searchTerm: { type: String },
      filteredProducts: { type: Array },
      selectedProduct: { type: Object },
    };

    static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    .search-container {
      position: relative;
      width: 100%;
      max-width: 400px;
    }
    input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid var(--border-color, #ccc);
      border-radius: 5px;
      outline: none;
      background-color: var(--background-color, #fff);
      color: var(--text-color, #000);
    }
    .dropdown {
      position: absolute;
      top: 40px;
      width: 100%;
      background: var(--background-color, #fff);
      border: 1px solid var(--border-color, #ccc);
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }
    .dropdown-item {
      padding: 10px;
      cursor: pointer;
    }
    .dropdown-item:hover {
      background-color: var(--hover-color, #f0f0f0);
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --background-color: #333;
        --text-color: #f0f0f0;
        --border-color: #555;
        --hover-color: #444;
      }
    }
  `;

    constructor() {
      super();
      this.fuse = new Fuse([], { keys: ['name'], threshold: 0.3 });
      this.loadProducts();
    }

    async loadProducts() {
      const cache = await caches.open('product-cache-v1');
      const cachedResponse = await cache.match('https://heisse-preise.io/data/latest-canonical.json');

      if (cachedResponse) {
        const products = await cachedResponse.json();
        this.productList = products;
      } else {
        try {
          const response = await fetch('https://heisse-preise.io/data/latest-canonical.json');
          const products = await response.json();
          this.productList = products;
          cache.put('https://heisse-preise.io/data/latest-canonical.json', response.clone());
        } catch (error) {
          console.error('Error loading products:', error);
        }
      }
    }

    set productList(products: Product[]) {
      this.products = products;
      this.fuse = new Fuse(products, { keys: ['name'], threshold: 0.3, includeScore: true });
    }

    updateSearch(e: Event) {
      const target = e.target as HTMLInputElement;
      this.searchTerm = target.value;

      if (this.searchTimeout) clearTimeout(this.searchTimeout);

      this.searchTimeout = window.setTimeout(() => {
        this.performSearch();
      }, 140); // Delays search by 300ms after last keystroke
    }

    performSearch() {
      if (this.searchTerm.length > 0) {
        const results = this.fuse.search(this.searchTerm, { limit: 10 });
        this.filteredProducts = results.map(result => result.item);
      } else {
        this.filteredProducts = [];
      }
    }

    selectProduct(product: Product) {
      this.selectedProduct = product;
      this.searchTerm = '';
      this.filteredProducts = [];
      this.dispatchEvent(new CustomEvent('product-selected', {
        detail: { product },
        bubbles: true,
        composed: true,
      }));
    }

    render() {
      return html`
        <div class="search-container">
          <input
            type="text"
            placeholder="Search for a product..."
            .value="${this.searchTerm}"
            @input="${this.updateSearch}"
          />
          ${this.filteredProducts.length > 0 ? html`
            <div class="dropdown">
              ${this.filteredProducts.map(product => html`
                <div
                  class="dropdown-item"
                  @click="${() => this.selectProduct(product)}"
                >
                (${product.store}) ${product.name}
                </div>
              `)}
            </div>
          ` : ''}
        </div>
      `;
    }
}
