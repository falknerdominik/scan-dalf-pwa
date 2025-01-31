import { LitElement, html, css } from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('thank-you')
class ThankYouPage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100vh;
      background-color: #f0f8ff;
      overflow: hidden;
    }

    .heart-container {
      position: relative;
      width: 100px;
      height: 100px;
    }

    .heart {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80px;
      height: 80px;
      background-color: #ff69b4;
      transform: translate(-50%, -50%) rotate(45deg);
      transform-origin: center; /* Ensure the heart spins in place */
      animation: spinY 3s linear infinite;
      z-index: 2; /* Keep the heart above the stars */
    }

    .heart::before,
    .heart::after {
      content: '';
      position: absolute;
      width: 80px;
      height: 80px;
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
      z-index: 1; /* Place stars behind the heart */
      pointer-events: none;
    }

    .small-star {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 15px;
      height: 15px;
      background-color: rgba(255, 223, 0, 0.8); /* Gold star color */
      clip-path: polygon(
        50% 0%,
        61% 35%,
        98% 35%,
        68% 57%,
        79% 91%,
        50% 70%,
        21% 91%,
        32% 57%,
        2% 35%,
        39% 35%
      );
      transform: translate(-50%, -50%);
      opacity: 1;
      animation: move-away 3s ease-out infinite;
    }

    @keyframes spinY {
      0% {
        transform: translate(-50%, -50%) rotateY(0deg) rotate(45deg);
      }
      100% {
        transform: translate(-50%, -50%) rotateY(360deg) rotate(45deg);
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

    .thank-you-text {
      margin-top: 20px;
      font-size: 24px;
      font-weight: bold;
      color: black; /* Black text color */
    }
  `;

  constructor() {
    super();
    this.redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
  }

  firstUpdated() {
    // Start the animation once the DOM is rendered
    this.startAnimation();

    // Redirect after 30 seconds
    setTimeout(() => {
      window.location.href = this.redirectUrl;
    }, 30000); // 30 seconds
  }

  startAnimation() {
    const starContainer = this.shadowRoot.querySelector('.star-container');

    if (!starContainer) {
      console.error('Star container not found');
      return;
    }

    for (let i = 0; i < 80; i++) {
      const smallStar = document.createElement('div');
      smallStar.classList.add('small-star');

      // Generate random directions for the stars
      const randomX = `${Math.random() * 400 - 200}px`; // -200px to +200px
      const randomY = `${Math.random() * 400 - 200}px`; // -200px to +200px
      smallStar.style.setProperty('--random-x', randomX);
      smallStar.style.setProperty('--random-y', randomY);

      starContainer.appendChild(smallStar);

      // Since the animation repeats infinitely, no need to remove stars
    }
  }

  render() {
    return html`
      <div class="heart-container">
        <div class="star-container"></div>
        <div class="heart"></div>
      </div>
      <div class="thank-you-text">Thank you</div>
    `;
  }
}

