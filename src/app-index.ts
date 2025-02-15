import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './pages/app-home';
import './components/header';
import './components/video-capture';
import './components/search-bar';
import './components/product-display';
import './components/bottom-bar';
import './styles/global.css';
import { router } from './router';

@customElement('app-index')
export class AppIndex extends LitElement {
  @state() loading = true;

  static styles = css`
    main {
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 16px;
    }
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-size: 1.5em;
    }
  `;

  firstUpdated() {
    this.checkCacheAndLoad();
    router.addEventListener('route-changed', () => {
      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() => this.requestUpdate());
      } else {
        this.requestUpdate();
      }
    });
  }

  async checkCacheAndLoad() {
    this.loading = true;
    const CACHE_NAME = 'product-cache-v1';
    // const DATA_URL = 'https://github.com/dominikfalkner/releases/latest/download/latest-canonical.tar.gz';
    const DATA_URL = 'https://heisse-preise.io/data/latest-canonical.json';


    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(DATA_URL);

    if (cachedResponse) {
        this.loading = false;
        return;
    }

    // Poll every second until cache is populated
    const interval = setInterval(async () => {
        const cachedResponse = await cache.match(DATA_URL);
        if (cachedResponse) {
            clearInterval(interval);
            this.loading = false;
        }
    }, 1000);
}

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          Loading products...
        </div>
      `;
    }

    // router config can be found in src/router.ts
    return router.render();
  }
}
