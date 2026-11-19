# Message Board Card

A clean, configurable Home Assistant Lovelace card that displays the state of a text sensor as an announcement or message board.

## Features

- Select a sensor entity from the visual editor
- Live updates whenever the sensor state changes
- Configurable title, icon, alignment, typography, colors, and corner radius
- Configurable empty-state message
- Preserves line breaks and whitespace in sensor messages
- Responsive layout and automatic message wrapping
- No external runtime dependencies

## Installation

### HACS (recommended)

1. Open **HACS → Dashboards**.
2. Open the three-dot menu and choose **Custom repositories**.
3. Add `anazario93/ha-message-board-card` with category **Dashboard**.
4. Install **Message Board Card**.
5. Refresh your browser.

### Manual

1. Download `message-board-card.js` from the latest release.
2. Copy it to `/config/www/message-board-card.js`.
3. Add it as a JavaScript module resource:

   - URL: `/local/message-board-card.js`
   - Resource type: **JavaScript Module**

## Configuration

The card is configured through the Lovelace visual editor. Add **Message Board Card**, then select the text sensor and adjust the presentation options.

A minimal YAML configuration is also supported:

```yaml
type: custom:message-board-card
entity: sensor.house_announcement
name: Announcements
icon: mdi:message-text
show_icon: true
show_title: true
alignment: left
font_size: 16
empty_message: No current announcements.
```

### Options

| Option | Description | Default |
| --- | --- | --- |
| `entity` | Text sensor whose state is displayed | Required |
| `name` | Card heading | Message Board |
| `icon` | Heading icon (Home Assistant MDI icon) | `mdi:message-text` |
| `show_icon` | Show the heading icon | `true` |
| `show_title` | Show the card heading | `true` |
| `alignment` | Message alignment: `left`, `center`, or `right` | `left` |
| `font_size` | Message font size in pixels | `16` |
| `message_background` | CSS color for the message panel | Theme-aware |
| `text_color` | CSS color for message text | Theme-aware |
| `border_radius` | Message panel corner radius in pixels | `12` |
| `empty_message` | Text shown when the sensor is empty or unavailable | `No message to display.` |

Colors accept standard CSS color values, including hex, RGB, and CSS color names. Leave a color field empty to use the Home Assistant theme.

## Example

```yaml
type: custom:message-board-card
entity: sensor.house_announcement
name: House Announcements
icon: mdi:bullhorn
show_icon: true
show_title: true
alignment: left
font_size: 17
message_background: "rgba(3, 169, 244, 0.08)"
text_color: "var(--primary-text-color)"
border_radius: 14
empty_message: All caught up!
```

## Support

Please open an issue in this repository if you find a bug or have a feature request.
