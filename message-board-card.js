const CARD_VERSION = "1.0.0";
const DEFAULTS = {
  name: "Message Board",
  icon: "mdi:message-text",
  show_icon: true,
  show_title: true,
  alignment: "left",
  font_size: 16,
  message_background: "",
  text_color: "",
  border_radius: 12,
  empty_message: "No message to display.",
};

class MessageBoardCard extends HTMLElement {
  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("Please define an entity for Message Board Card.");
    }

    this._config = { ...DEFAULTS, ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement("message-board-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "sensor.example",
      name: "Message Board",
      icon: "mdi:message-text",
    };
  }

  _render() {
    if (!this._config || !this._hass) return;

    const stateObj = this._hass.states[this._config.entity];
    const rawMessage = stateObj?.state;
    const isEmpty =
      rawMessage === undefined ||
      rawMessage === null ||
      rawMessage === "" ||
      rawMessage === "unknown" ||
      rawMessage === "unavailable";
    const message = isEmpty ? this._config.empty_message : rawMessage;

    const config = this._config;
    const background = config.message_background || "var(--ha-card-background, var(--card-background-color, #fff))";
    const color = config.text_color || "var(--primary-text-color)";
    const radius = this._safeNumber(config.border_radius, 12, 0, 48);
    const fontSize = this._safeNumber(config.font_size, 16, 10, 48);
    const alignment = ["left", "center", "right"].includes(config.alignment)
      ? config.alignment
      : "left";

    if (!this.shadowRoot) this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-card {
          overflow: hidden;
          color: var(--primary-text-color);
        }
        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 16px 0;
          min-height: 28px;
        }
        .header ha-icon {
          color: var(--state-icon-color, var(--secondary-text-color));
          --mdc-icon-size: 22px;
          flex: 0 0 auto;
        }
        .title {
          font-size: 16px;
          line-height: 1.4;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .message {
          margin: 16px;
          padding: 16px;
          border-radius: ${radius}px;
          background: ${this._escapeCss(background)};
          color: ${this._escapeCss(color)};
          font-size: ${fontSize}px;
          line-height: 1.55;
          text-align: ${alignment};
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: normal;
          min-height: 24px;
          box-sizing: border-box;
        }
        .message.empty {
          color: var(--secondary-text-color);
          font-style: italic;
        }
        .message.no-title {
          margin-top: 16px;
        }
      </style>
      <ha-card>
        ${config.show_title ? `
          <div class="header">
            ${config.show_icon && config.icon ? `<ha-icon icon="${this._escapeHtml(config.icon)}"></ha-icon>` : ""}
            <div class="title">${this._escapeHtml(config.name || "Message Board")}</div>
          </div>
        ` : ""}
        <div class="message ${isEmpty ? "empty" : ""} ${config.show_title ? "" : "no-title"}">${this._escapeHtml(String(message ?? ""))}</div>
      </ha-card>
    `;
  }

  _safeNumber(value, fallback, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }

  _escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  _escapeCss(value) {
    // Prevent style attribute injection while allowing common CSS color syntax.
    return String(value).replace(/[;{}<>]/g, "");
  }
}

class MessageBoardCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._form = document.createElement("ha-form");
    this._form.addEventListener("value-changed", (event) => this._valueChanged(event));
    this._form.computeLabel = (schema) => schema.label ?? schema.name;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
      </style>
    `;
    this.shadowRoot.append(this._form);
  }

  setConfig(config) {
    this._config = { ...DEFAULTS, ...config };
    this._updateForm();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateForm();
  }

  _schema() {
    return [
      {
        name: "entity",
        label: "Text sensor",
        required: true,
        selector: { entity: { filter: [{ domain: "input_text" }] } },
      },
      {
        name: "name",
        label: "Card title",
        selector: { text: {} },
      },
      {
        name: "icon",
        label: "Title icon",
        selector: { icon: {} },
      },
      {
        name: "show_title",
        label: "Show card title",
        selector: { boolean: {} },
      },
      {
        name: "show_icon",
        label: "Show title icon",
        selector: { boolean: {} },
      },
      {
        name: "alignment",
        label: "Message alignment",
        selector: {
          select: {
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
            mode: "dropdown",
          },
        },
      },
      {
        name: "font_size",
        label: "Message font size (px)",
        selector: { number: { min: 10, max: 48, step: 1, mode: "slider" } },
      },
      {
        name: "message_background",
        label: "Message background (CSS color; blank uses theme)",
        selector: { text: {} },
      },
      {
        name: "text_color",
        label: "Message text color (CSS color; blank uses theme)",
        selector: { text: {} },
      },
      {
        name: "border_radius",
        label: "Message corner radius (px)",
        selector: { number: { min: 0, max: 48, step: 1, mode: "slider" } },
      },
      {
        name: "empty_message",
        label: "Message shown when the sensor is empty",
        selector: { text: {} },
      },
    ];
  }

  _updateForm() {
    if (!this._form || !this._config) return;
    this._form.hass = this._hass;
    this._form.data = this._config;
    this._form.schema = this._schema();
  }

  _valueChanged(event) {
    const next = event.detail?.value;
    if (!next) return;

    this._config = { ...this._config, ...next };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

if (!customElements.get("message-board-card")) {
  customElements.define("message-board-card", MessageBoardCard);
}
if (!customElements.get("message-board-card-editor")) {
  customElements.define("message-board-card-editor", MessageBoardCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "message-board-card",
  name: "Message Board Card",
  description: "A clean announcement board powered by a Home Assistant text sensor.",
  preview: true,
  documentationURL: "https://github.com/anazario93/ha-message-board-card",
});

console.info(
  `%c MESSAGE-BOARD-CARD %c v${CARD_VERSION} `,
  "color: white; background: #1686a0; font-weight: bold;",
  "color: #1686a0; background: white; font-weight: bold;"
);
