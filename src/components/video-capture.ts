import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { query } from 'lit/decorators.js';

import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill'

@customElement('video-capture')
export class BarcodeScanner extends LitElement {
  @property({ type: Boolean })
  scanning = false;

  @property({ type: String }) lastScannedBarcode: string | null = null;

  @query('#videoElement')
  private videoElement!: HTMLVideoElement;

  // tslint:disable-next-line
  private barcodeDetector: BarcodeDetector | null = null;
  private stream: MediaStream | null = null;

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
    }
    video {
      width: 100%;
      height: auto;
      border: 1px solid #ddd;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 1.5rem;
    }
  `;

  async firstUpdated() {
    if ('BarcodeDetector' in window) {
      this.barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'code_128'] });
    } else {
      this.barcodeDetector = new BarcodeDetectorPolyfill({ formats: ['qr_code', 'ean_13', 'code_128'] });
    }
    this.startCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.videoElement.srcObject = this.stream;
      this.videoElement.play();
      this.scanning = true;
      this.scanFrame();
    } catch (error) {
      console.error('Error accessing the camera', error);
    }
  }

  async scanFrame() {
    if (this.scanning && this.barcodeDetector) {
      try {
        const barcodes = await this.barcodeDetector.detect(this.videoElement);
        if (barcodes.length > 0) {
          barcodes.forEach((barcode: { rawValue: any; }) => {
            console.log('Barcode detected:', barcode.rawValue);
            this.dispatchEvent(new CustomEvent('barcode-detected', {
              detail: barcode.rawValue,
              bubbles: true,
              composed: true,
            }));
          });
        }
      } catch (error) {
        console.error('Barcode detection error', error);
      }
      requestAnimationFrame(() => this.scanFrame());
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.scanning = false;
    }
  }

  render() {
    return html`
      <video id="videoElement"></video>
      ${this.scanning ? '' : html`<div class="overlay">Camera not active</div>`}
    `;
  }
}
