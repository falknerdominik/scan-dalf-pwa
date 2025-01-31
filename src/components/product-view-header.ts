import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('simple-greeting')
class CustomHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      margin: 0; /* Ensure no margin for the root element */
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #28a745; /* Appealing green */
      color: white;
      padding: 10px 20px;
      font-family: Arial, sans-serif;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    .left-section {
      display: flex;
      align-items: center;
    }

    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: #218838; /* Slightly darker green for contrast */
      border: none;
      border-radius: 50%;
      cursor: pointer;
      margin-right: 15px;
      color: white;
      font-size: 20px;
      transition: background-color 0.2s ease;
    }

    .back-button:hover {
      background-color: #1e7e34;
    }

    .header-text,
    .header-text input {
      color: white;
      font-size: 18px;
      font-weight: bold;
      font-family: Arial, sans-serif;
      background-color: transparent;
      border: none;
      outline: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      display: inline-block;
    }

    .header-text input {
      cursor: text;
      width: auto;
    }

    .chip {
      background-color: #34ce57; /* Lighter green for contrast */
      color: white;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      transition: background-color 0.2s ease, box-shadow 0.2s ease;
      border: none;
      display: inline-block;
    }

    .chip:hover {
      background-color: #28a745; /* Match the header green on hover */
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    }
  `;

  static properties = {
    headerText: { type: String }, // Editable text
    chipLabel: { type: String }, // Chip label
    editing: { type: Boolean }, // Tracks if the header text is being edited
  };

  constructor() {
    super();
    this.headerText = 'Header Title';
    this.chipLabel = 'Chip Label';
    this.editing = false;
  }

  backButtonPressed() {
    console.log('Back button pressed');
    // Add your custom back navigation logic here
  }

  chipClicked() {
    console.log('Chip clicked');
    // Add your custom chip action here
  }

  enableEditing() {
    this.editing = true;
    this.updateComplete.then(() => {
      const input = this.renderRoot.querySelector('input');
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  saveHeaderText(e) {
    if (e.type === 'blur' || e.key === 'Enter') {
      this.headerText = e.target.value;
      this.editing = false;
      console.log('Header text updated to:', this.headerText);
    }
  }

  render() {
    return html`
      <div class="header">
        <div class="left-section">
          <button
            class="back-button"
            @click="${this.backButtonPressed}"
            aria-label="Go back"
          >
            ←
          </button>
          ${this.editing
            ? html`<input
                type="text"
                class="header-text"
                .value="${this.headerText}"
                @blur="${this.saveHeaderText}"
                @keydown="${this.saveHeaderText}"
              />`
            : html`<span
                class="header-text"
                @click="${this.enableEditing}"
                >${this.headerText}</span
              >`}
        </div>
        <div>
          <button class="chip" @click="${this.chipClicked}">
            ${this.chipLabel}
          </button>
        </div>
      </div>
    `;
  }
}