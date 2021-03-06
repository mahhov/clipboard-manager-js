const path = require('path');
const {ViewHandle, XPromise} = require('js-desktop-base');

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
			webPreferences: {nodeIntegration: true},
		}, path.join(__dirname, './view/View.html'));

		this.addWindowListener('blur', () => this.hide());
	}

	onMessage(message) {
		switch (message.name) {
			case 'close':
				this.hide();
				this.onClose(message);
				break;
			case 'squash':
				this.onSquash(message);
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

	squashFront2() {
		this.squashPromise = new XPromise();
		this.send({name: 'squashFront2'});
		return this.squashPromise;
	}

	onSquash(message) {
		this.squashPromise.resolve(message.squashedText);
	}
}

module.exports = ClipboardManagerViewHandle;
