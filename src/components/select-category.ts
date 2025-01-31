import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('simple-greeting')
class StoreSelectionPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h1 {
      margin-bottom: 20px;
    }

    .store-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      width: 100%;
      max-width: 800px;
    }

    .store-tile {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      background-color: #6c757d;
      color: white;
      font-size: 16px;
      font-weight: bold;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .store-tile:hover {
      transform: scale(1.05);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }

    .store-tile.selected {
      outline: 3px solid #007bff;
      box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.4);
    }

    .info {
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #333;
    }
  `;

  static properties = {
    stores: { type: Array },
    selectedStore: { type: Object },
  };

  constructor() {
    super();
    this.stores = [];
    this.selectedStore = null;
    this.generateStores();
  }

  generateStores() {
    for (let i = 1; i <= 20; i++) {
      this.stores.push({ id: i, name: `Store ${i}` });
    }
  }

  selectStore(store) {
    if (this.selectedStore?.id === store.id) {
      this.selectedStore = null; // Deselect if the same tile is clicked
    } else {
      this.selectedStore = store;
      console.log('Selected Store:', this.selectedStore);
    }
  }

  render() {
    return html`
      <h1>Select a Store</h1>
      <div class="store-grid">
        ${this.stores.map(
          (store) => html`
            <div
              class="store-tile ${this.selectedStore?.id === store.id
                ? 'selected'
                : ''}"
              @click="${() => this.selectStore(store)}"
            >
              ${store.name}
            </div>
          `
        )}
      </div>
      <div class="info">
        ${this.selectedStore
          ? html`You have selected: <b>${this.selectedStore.name}</b>`
          : 'No store selected.'}
      </div>
    `;
  }
}