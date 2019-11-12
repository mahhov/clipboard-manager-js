const SELECTED_TEXT_COLOR = '#fff';
const SELECTED_BG_COLOR = '#646496';

class Texts {
	constructor(displaySize, previewSize, historySize) {
		this.displaySize = displaySize;
		this.previewSize = previewSize;
		this.historySize = historySize;
		this.texts = [];
		this.selected = 0;
		this.searchText_ = '';
		this.filteredTexts = [];
	}

	addFront(text) {
		this.remove(text);
		this.texts.unshift(text);
		if (this.texts.length > this.historySize)
			this.texts.pop();
		this.filterTexts();
	}

	removeSelected() {
		this.remove(this.selectedText);
		this.filterTexts();
		this.boundSelection();
	}

	remove(text) {
		let index = this.texts.indexOf(text);
		if (index !== -1)
			this.texts.splice(index, 1);
	}

	get searchText() {
		return this.searchText_;
	}

	set searchText(value) {
		this.searchText_ = value;
		this.filterTexts();
		this.boundSelection();
	}

	filterTexts() {
		this.filteredTexts = this.texts.filter(text =>
			text.toLowerCase().includes(this.searchText.toLowerCase()));
	}

	selectPrev() {
		this.selected = (--this.selected + this.size) % this.size;
	}

	selectNext() {
		this.selected = ++this.selected % this.size;
	}

	selectFirst() {
		this.selected = 0;
	}

	selectLast() {
		this.selected = this.size - 1;
	}

	boundSelection() {
		this.selected = Math.max(Math.min(this.selected, this.size - 1), 0);
	}

	get size() {
		return Math.min(this.filteredTexts.length, this.displaySize);
	}

	get selectedText() {
		return this.filteredTexts[this.selected];
	}

	// returns [{text, textColor?, backColor?}]
	getLinesForDisplay() {
		let lines = Array(this.displaySize + 1 + this.previewSize + 1).fill({text: ''});

		Texts.setLines(lines, [{text: this.searchText}], this.displaySize + 1 + this.previewSize);

		if (!this.filteredTexts.length)
			return lines;

		Texts.setLines(lines, this.filteredTexts.slice(0, this.size).map(text => ({text})));
		lines[this.selected].textColor = SELECTED_TEXT_COLOR;
		lines[this.selected].backColor = SELECTED_BG_COLOR;

		let selectedLines = this.selectedText.split('\n');
		if (selectedLines.length > this.previewSize) {
			selectedLines = selectedLines.slice(0, this.previewSize - 1);
			selectedLines.push('...');
		}
		Texts.setLines(lines, selectedLines.map(text =>
			({text, textColor: SELECTED_BG_COLOR, backColor: SELECTED_TEXT_COLOR})), this.size + 1);

		return lines;
	}

	static setLines(lines, values, start = 0) {
		values.forEach((value, i) => lines[i + start] = value);
	}
}

module.exports = Texts;
