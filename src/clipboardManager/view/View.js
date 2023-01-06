const {ipcRenderer: ipc} = require('electron');
const Texts = require('./Texts');

const $ = document.querySelector.bind(document);
const $c = document.createElement.bind(document);

let texts = new Texts(10, 10, 200);

let ipcSend = message => ipc.send('window-request', message);

ipc.on('window-command', (_, command) => {
	console.log('received', command);
	switch (command.name) {
		case 'addText':
			texts.addFront(command.text);
			break;
		case 'open':
			texts.searchText = '';
			texts.selectFirst();
			updateView();
			break;
		default:
			console.error('Unknown window command:', command);
	}
});

let updateView = () => {
	let container = $('#container');
	while (container.firstChild)
		container.firstChild.remove();

	texts.getLinesForDisplay().forEach(({text, textColor = '#000', backColor = '#fff'}) => {
		let lineTextEl = $c('span');
		lineTextEl.textContent = text;
		lineTextEl.style.color = textColor;
		lineTextEl.style.backgroundColor = backColor;
		let lineEl = $c('div');
		lineEl.appendChild(lineTextEl);
		container.appendChild(lineEl);
	})
};

document.body.addEventListener('keydown', e => {
	switch (e.key) {
		case 'ArrowLeft':
			texts.selectFirst();
			break;
		case 'ArrowUp':
			texts.selectPrev();
			break;
		case 'ArrowRight':
			texts.selectLast();
			break;
		case 'ArrowDown':
			texts.selectNext();
			break;
		case 'Delete':
		case 'Backspace':
			if (e.shiftKey)
				texts.removeSelected();
			else
				texts.searchText = texts.searchText.slice(0, -1);
			break;
		case 'Enter':
			ipcSend({name: 'close', selected: texts.selectedText});
			break;
		case 'Escape':
			ipcSend({name: 'close'});
			break;
		default:
			if (e.key.length === 1)
				texts.searchText += e.key;
	}
	updateView();
});
