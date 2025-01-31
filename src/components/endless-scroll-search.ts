import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('edless-scroll-search')
class EndlessScrollList extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: Arial, sans-serif;
    }

    .search-bar {
      position: sticky;
      top: 0;
      z-index: 10;
      background: white;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-bar input {
      width: 100%;
      padding: 8px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .list-container {
      flex: 1;
      overflow-y: auto;
      padding: 5px;
      background-color: #f9f9f9;
    }

    .list-item {
      padding: 14px;
      margin-bottom: 8px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .list-item:nth-child(odd) {
      background-color: #f7f7f7; /* Slightly shaded for odd items */
    }

    .list-item:hover {
      background-color: #eaeaea;
    }

    @media (max-width: 768px) {
      /* Mobile styles */
      .list-item {
        padding: 18px; /* Increased padding for mobile */
      }
    }
  `;

  static properties = {
    items: { type: Array },
    displayedItems: { type: Array },
    searchQuery: { type: String },
    currentPage: { type: Number },
    pageSize: { type: Number },
    isLoading: { type: Boolean },
  };

  constructor() {
    super();
    this.items = [];
    this.displayedItems = [];
    this.searchQuery = '';
    this.currentPage = 1;
    this.pageSize = 20;
    this.isLoading = false;

    // Generate 1000 items
    this.generateItems(1000);
  }

  generateItems(total) {
    // Create items incrementally
    for (let i = 1; i <= total; i++) {
      this.items.push(`Item ${i}`);
    }
    this.updateDisplayedItems();
  }

  updateDisplayedItems() {
    const start = 0;
    const end = this.currentPage * this.pageSize;
    const filtered = this.items.filter((item) =>
      item.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.displayedItems = filtered.slice(start, end);
  }

  handleSearch(e) {
    this.searchQuery = e.target.value.toLowerCase();
    this.currentPage = 1; // Reset to the first page
    this.updateDisplayedItems();
  }

  handleScroll(e) {
    if (this.isLoading) return; // Prevent overlapping loads

    const container = e.target;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      this.loadMoreItems();
    }
  }

  loadMoreItems() {
    if (this.isLoading) return;

    this.isLoading = true;
    setTimeout(() => {
      this.currentPage++;
      this.updateDisplayedItems();
      this.isLoading = false;
    }, 300); // Simulate loading delay for better UX
  }

  handleItemClick(item) {
    console.log('Selected:', item);
  }

  render() {
    return html`
      <div class="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          @input="${this.handleSearch}"
        />
      </div>
      <div class="list-container" @scroll="${this.handleScroll}">
        ${this.displayedItems.map(
          (item, index) =>
            html`<div
              class="list-item"
              @click="${() => this.handleItemClick(item)}"
            >
              ${item}
            </div>`
        )}
        ${this.isLoading
          ? html`<div class="list-item">Loading more items...</div>`
          : ''}
      </div>
    `;
  }
}
