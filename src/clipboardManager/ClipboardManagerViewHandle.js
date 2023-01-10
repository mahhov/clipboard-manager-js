const path = require('path');
const {ViewHandle} = require('js-desktop-base');

class ClipboardManagerViewHandle extends ViewHandle {
	constructor() {
		super({
			width: 500,
			height: 450,
			frame: false,
			thickFrame: false,
			skipTaskbar: true,
			alwaysOnTop: true,
			show: false,
			webPreferences: {nodeIntegration: true, contextIsolation: false},
		}, path.join(__dirname, './view/View.html'));

		this.addWindowListener('blur', () => this.hide());
	}

	onMessage(message) {
		switch (message.name) {
			case 'close':
				this.hide();
				this.onClose(message);
				break;
			default:
				console.error('Unknown window request:', message);
		}
	}

	addSelectListener(selectListener) {
		this.selectListener = selectListener;
	}

	onClose(message) {
		if (message.selected && this.selectListener)
			this.selectListener(message.selected);
	}

	sendText(text) {
		this.send({name: 'addText', text});
	}
}

module.exports = ClipboardManagerViewHandle;
