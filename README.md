# ![logo](src/assets/logo-24x24.png) Emoji Keyboard

[![Xtension](https://circleci.com/gh/justiceo/emoji-keyboard/tree/main.svg?style=svg)](https://circleci.com/gh/justiceo/emoji-keyboard/?branch=main)

Use emojis anywhere on the web!

![Screenshot](src/assets/screenshot.png "Screenshot")

## Downloads
<table cellspacing="0" cellpadding="0">
  <tr style="text-align: center">
    <td valign="center">
      <a align="center" href="https://chrome.google.com/webstore/detail/nekacekgelnakbmhepjioandkacfablo">
        <img src="src/assets/browser-chrome.png" alt="Chrome web store" width="50" />
        <p align="center">Chrome Web Store</p>
      </a>
    </td>
    <td valign="center">
      <a href="https://addons.mozilla.org/firefox/extensions/">
        <img src="src/assets/browser-firefox.png" alt="Firefox add-ons" width="50" />
        <p align="center">Firefox Add-ons</p>
      </a>
    </td>
        <td valign="center">
      <a href="https://addons.opera.com/en/extensions/">
        <img src="src/assets/browser-opera.png" alt="Opera add-ons" width="50"/>
        <p align="center">Opera Add-ons</p>
      </a>
    </td>
        <td valign="center">
      <a href="https://microsoftedge.microsoft.com/addons">
        <img src="src/assets/browser-ms-edge.png" alt="MS Edge add-ons" width="50" />
        <p align="center">Ms Edge Add-ons</p>
      </a>
    </td>
        <td valign="center">
      <a href="https://apps.apple.com/app/apple-store/">
        <img src="src/assets/browser-safari.png" alt="Safari add-ons" width="50" />
        <p align="center">Safari Extensions</p>
      </a>
    </td>
  </tr>
</table>

## Features

* Privacy-friendly.
* Highly configurable options page.
* Disable for specific sites.
* Sync settings across browsers.

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
