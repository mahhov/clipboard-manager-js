const path = require('path');
const {TrayHelper, ClipboardListener, ShortcutListener} = require('js-desktop-base');
const ViewHandle = require('./ClipboardManagerViewHandle.js');

let trayIcon = path.join(__dirname, '../../resources/icons/fa-copy-regular-256.png');
TrayHelper.createExitTray(trayIcon, 'Clipboard');

let viewHandle = new ViewHandle();

// on clipboard change, send new clipboard to view
let clipboardListener = new ClipboardListener();
clipboardListener.addListener(text => viewHandle.sendText(text.trim()));

// on text select, set clipboard
viewHandle.addSelectListener(ClipboardListener.paste);

// on ctrl shift v, send open
ShortcutListener.add('Control+Shift+V', () => viewHandle.show());
