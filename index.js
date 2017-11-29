const htmlToDom = (html) => {
	const div = document.createElement('div');

	div.innerHTML = html;

	const elements = div.childNodes;

	if (elements.length === 1) {
		return elements[0];
	}

	// TODO: Array instead of DOMList?
	return elements;
};

const escapeHtmlAttribute = attribute => attribute.replace(/"/g, '\\"');

const escapeHtmlTags = str => str
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');

class HTML {
	constructor(markup) {
		this.markup = markup;
	}

	toString() {
		return this.markup;
	}

	toElement() {
		return htmlToDom(this.markup);
	}

	static createSafeString(markup) {
		return markup instanceof HTML
			? markup
			: escapeHtmlTags(markup);
	}

	static markup(strings, ...values) {
		const markup = strings
			.reduce(
				(accum, string, i) => accum + string + transformValue(values[i]),
				'',
			)
			.trim();

		return new HTML(markup);
	}

	static dom(...args) {
		return HTML.markup(...args).toElement();
	}
}

const betterTypeOf = (value) => {
	const type = Object.prototype.toString.call(value);
	return type.substr(8, type.length - 9).toLowerCase();
};

// eslint-disable-next-line no-use-before-define
const transformArray = value => value.map(transformValue).join('');

const transformValue = (value) => {
	if (value instanceof HTMLElement) {
		return value.outerHTML;
	}

	if (value instanceof NodeList) {
		return transformArray([...value]);
	}

	if (value instanceof HTML) {
		return value;
	}

	switch (betterTypeOf(value)) {
		case 'string':
			return HTML.createSafeString(value);

		case 'array':
			return transformArray(value);

		case 'object':
			return Object
				.keys(value)
				.map(key => `${key}="${escapeHtmlAttribute(value[key])}"`)
				.join(' ');

		case 'undefined':
			return '';

		default:
			return JSON.stringify(value);
	}
};

module.exports = HTML;
