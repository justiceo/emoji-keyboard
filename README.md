# ![logo](src/assets/logo-24x24.png) Emoji Keyboard

[![Xtension](https://circleci.com/gh/justiceo/emoji-keyboard/tree/main.svg?style=svg)](https://circleci.com/gh/justiceo/emoji-keyboard/?branch=main)

Use emojis anywhere on the web!

Download on the Chrome Webstore - https://chrome.google.com/webstore/detail/nekacekgelnakbmhepjioandkacfablo

![Screenshot](src/assets/screenshot.png "Screenshot")

## Features

- It can suggest relevant emojis. When invoked after the text "Congrats!", it will suggest ':confetti'
- Intelligent search algorithm makes it easier to find the emoji you're looking, no need to remember the emoji name, typos welcome.
- Privacy-friendly.
- Highly configurable options page.
- Disable for specific sites.

## Project setup

```bash
# Install dependencies
npm install

# Build extension for development, watch for file changes and rebuild.
npm run build
npm run watch

# Generate compliant images assets for logo (default logo location src/assets/logo.png)
npm run generateIcons

# Translate app strings to all supported chrome locales
npm run translate

# Start an instance of Chromium with extension installed (using puppeteer)
# For Firefox, pass --browser=firefox as argument.
npm run build start

# Build and package extension into a store-ready upload
node tools/esbuild.js build --prod

# Create extension package for Firefox/Opera/Edge by specifying --browser argument
node tools/esbuild.js build --prod  --browser=firefox

# Run tests
npm run test
```

### Install Locally

#### Chrome

1. Open chrome and navigate to extensions page using this URL: chrome://extensions.
2. Enable the "Developer mode".
3. Click "Load unpacked extension" button, browse the `build/chrome-dev` directory and select it.

### Firefox

1. Open firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click the "Load Temporary Add-on" button.
3. Browse the `build/firefox-dev` directory and select the `manifest.json` file.

<br>
<br>
