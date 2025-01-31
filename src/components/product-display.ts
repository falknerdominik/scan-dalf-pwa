import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Chart from 'chart.js/auto';

interface ProductData {
  store: string;
  id: string;
  name: string;
  description: string;
  price: number;
  priceHistory: { date: string; price: number }[];
  isWeighted: boolean;
  unit: string;
  quantity: number;
  bio: boolean;
  url: string;
  category: string;
  unavailable: boolean;
}

@customElement('product-display')
export class ProductDisplay extends LitElement {
  @property({ type: Object }) product: ProductData | null = null;
  private chartInstance: Chart | null = null;

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      margin: 10px;
    }
    .product-card {
      border: 1px solid var(--border-color, #ddd);
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background-color: var(--background-color, #fff);
      color: var(--text-color, #000);
      transition: box-shadow 0.3s ease-in-out;
    }
    .product-card:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    .product-header {
      font-size: 1.5em;
      margin: 0 0 8px;
    }
    .price {
      color: green;
      font-size: 1.2em;
    }
    .unavailable {
      color: red;
      font-weight: bold;
    }
    .store {
      margin-top: 8px;
      font-size: 0.9em;
      color: var(--secondary-text-color, #666);
    }
    .link {
      display: inline-block;
      margin-top: 12px;
      text-decoration: none;
      color: #1a73e8;
    }
    .chart-container {
      margin-top: 20px;
      height: 200px;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --background-color: #333;
        --text-color: #f0f0f0;
        --border-color: #555;
        --secondary-text-color: #bbb;
      }
    }
    @media (max-width: 600px) {
      .product-card {
        padding: 12px;
        max-width: 100%;
      }
      .product-header {
        font-size: 1.2em;
      }
      .price {
        font-size: 1em;
      }
    }
  `;

  firstUpdated() {
    this.renderChart();
  }

  updated() {
    this.renderChart();
  }

  renderChart() {
    if (this.product && this.product.priceHistory.length > 0) {
      const ctx = this.shadowRoot?.querySelector('#priceChart') as HTMLCanvasElement;
      if (ctx) {
        // Destroy existing chart if it exists
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        // Sort price history by date
        const sortedHistory = this.product.priceHistory.sort((a, b) => a.date.localeCompare(b.date));

        // Create new chart
        this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: sortedHistory.map(item => item.date),
            datasets: [{
              label: 'Price History',
              data: sortedHistory.map(item => item.price),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Date'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Price (€)'
                }
              }
            }
          }
        });
      }
    }
  }

  render() {
    if (!this.product) {
      return html`<div>No product selected</div>`;
    }

    return html`
      <div class="product-card">
        <div class="product-header">${this.product.name}</div>
        <div class="price">${this.product.price.toFixed(2)} € / ${this.product.unit}</div>
        ${this.product.unavailable ? html`<div class="unavailable">Unavailable</div>` : ''}
        <div class="store">Store: ${this.product.store}</div>
        <div class="chart-container">
          <canvas id="priceChart"></canvas>
        </div>
      </div>
    `;
  }
}
