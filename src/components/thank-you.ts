import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('thank-you')
export class ThankYou extends LitElement {
  redirectUrl: string;
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      font-family: 'Arial', sans-serif;
    }

    .heart-container {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .heart {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      background-color: #ff69b4;
      transform: translate(-50%, -50%) rotate(45deg);
      transform-origin: center;
      animation: spinY 3s linear infinite, pulse 1.5s ease-in-out infinite, glow 2s ease-in-out infinite;
      z-index: 2;
      box-shadow: 0 0 20px rgba(255, 105, 180, 0.8);
    }

    .heart::before,
    .heart::after {
      content: '';
      position: absolute;
      width: 100px;
      height: 100px;
      background-color: #ff69b4;
      border-radius: 50%;
    }

    .heart::before {
      top: -50%;
      left: 0;
    }

    .heart::after {
      left: -50%;
      top: 0;
    }

    .star-container {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      pointer-events: none;
    }

    @keyframes spinY {
      0% {
        transform: translate(-50%, -50%) rotateY(0deg) rotate(45deg);
      }
      100% {
        transform: translate(-50%, -50%) rotateY(360deg) rotate(45deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: translate(-50%, -50%) rotate(45deg) scale(1);
      }
      50% {
        transform: translate(-50%, -50%) rotate(45deg) scale(1.1);
      }
    }

    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(255, 105, 180, 0.8);
      }
      50% {
        box-shadow: 0 0 30px rgba(255, 105, 180, 1);
      }
    }

    @keyframes move-away {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(calc(-50% + var(--random-x)), calc(-50% + var(--random-y))) scale(0);
        opacity: 0;
      }
    }

    @keyframes sparkle {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .thank-you-text {
      margin-top: 20px;
      font-size: 32px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      animation: fade-in 2s ease-in-out;
    }

    @keyframes fade-in {
      0% {
        opacity: 0;
        transform: translateY(-20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  constructor() {
    super();
    this.redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
  }

  firstUpdated() {
    const redirect = () => {
      window.location.href = this.redirectUrl;
    };

    // Set timeout for redirection
    const timeoutId = setTimeout(redirect, 30000);

    // Add click event listener to redirect on tap
    this.addEventListener('click', () => {
      clearTimeout(timeoutId); // Clear the timeout if user taps
      redirect();
    });
  }

  render() {
    return html`
      <div class="heart-container">
        <div class="heart"></div>
      </div>
      <div class="thank-you-text">Thank you</div>
    `;
  }
}
