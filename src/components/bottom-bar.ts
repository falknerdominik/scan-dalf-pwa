import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface NavItem {
  url: string;
  text: string;
  icon: string;
}

@customElement('bottom-bar')
export class BottomBar extends LitElement {
  @state() items: Record<string, NavItem> = {
    'i1': {
      'url': '#',
      'text': 'Home',
      'icon': 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/home.svg'
    },
    'i2': {
      'url': '#',
      'text': 'Search',
      'icon': 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/magnifying-glass.svg'
    },
    'i3': {
      'url': '#',
      'text': 'Info',
      'icon': 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/circle-info.svg'
    }
  };

  static styles = css`
    :host {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(135deg, #2c3e50, #4a69bd);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
      border-top: 2px solid rgba(255, 255, 255, 0.1);
    }

    nav {
      display: flex;
      justify-content: space-evenly;
      padding: 0;
      width: 100%;
      max-width: 600px;
    }

    a {
      color: white;
      text-decoration: none;
      font-size: 26px;
      transition: transform 0.2s ease, background 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 15px;
      will-change: transform;
    }

    a:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    img {
      width: 25px;
      height: 25px;
      filter: invert(1);
    }

    span {
      font-size: 12px;
      margin-top: 5px;
      color: white;
    }
  `;

  render() {
    return html`
      <nav>
        ${Object.values(this.items).map(
          ({ url, text, icon }: NavItem) => html`
            <a href="${url}" target="_blank">
              <img src="${icon}" alt="${text}">
              <!--<span>${text}</span>-->
            </a>
          `
        )}
      </nav>
    `;
  }
}
