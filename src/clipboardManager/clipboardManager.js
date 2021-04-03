const path = require('path');
const {clipboard} = require('electron');
const {TrayHelper, ClipboardListener, ShortcutListener, keySender} = require('js-desktop-base');
const ViewHandle = require('./ClipboardManagerViewHandle.js');

let trayIcon = path.join(__dirname, '../../resources/icons/fa-copy-regular-256.png');
TrayHelper.createExitTray(trayIcon, 'Clipboard');

let viewHandle = new ViewHandle();

// on clipboardListener change, send new clipboardListener to view
let clipboardListener = new ClipboardListener();
clipboardListener.addListener(text => viewHandle.sendText(text.trim()));

// on text select, set clipboardListener
viewHandle.addSelectListener(text => ClipboardListener.paste(text));

// on ctrl shift v, send open
ShortcutListener.add('Control+Shift+V', () => viewHandle.show());

// on ctrl shift c, send clipboardListener to view as incremental copy
ShortcutListener.add('Control+Shift+C', async () => {
	keySender.string(keySender.RELEASE, '{control}{shift}c');
	await clipboardListener.copy();
	keySender.string(keySender.PRESS, '{control}{shift}');
	clipboard.writeText(await viewHandle.squashFront2());
});
