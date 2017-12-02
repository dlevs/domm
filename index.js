const betterTypeof = require('better-typeof');

/**
 * Create DOM nodes for a HTML string.
 *
 * @param {string} html
 * @returns {NodeList|Element}
 */
const htmlToDom = (html) => {
	const div = document.createElement('div');

	div.innerHTML = html;

	const elements = div.childNodes;

	if (elements.length === 1) {
		return elements[0];
	}

	return elements;
};

/**
 * Escape HTML tags so they can be safely added to the page with no
 * chance of XSS.
 *
 * @param {string} str
 * @returns {string}
 */
const escapeHtmlTags = str => str
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');

/**
 * Escape illegal characters for HTML attribute values.
 *
 * @param {string} attribute
 * @returns {string}
 */
const escapeHtmlAttribute = attribute => escapeHtmlTags(attribute.replace(/"/g, '\\"'));

/**
 * Transform to apply to Array values interpolated via template literals.
 *
 * @param {Array} value
 * @returns {string}
 */
const transformArray = value =>
	// eslint-disable-next-line no-use-before-define
	value.map(transformValue).join('');

/**
 * Transform to apply to all values interpolated via template literals
 * in order to represent them as strings.
 *
 * @param {*} value
 * @returns {string}
 */
const transformValue = (value) => {
	if (value instanceof HTMLElement) {
		return value.outerHTML;
	}

	if (value instanceof NodeList) {
		return transformArray([...value]);
	}

	// eslint-disable-next-line no-use-before-define
	if (value instanceof Domm) {
		return value;
	}

	switch (betterTypeof(value)) {
		case 'string':
			// eslint-disable-next-line no-use-before-define
			return Domm.createSafeString(value);

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

class Domm {
	constructor(html) {
		this.html = html;
	}

	toString() {
		return this.html;
	}

	toElement() {
		return htmlToDom(this.html);
	}

	static createSafeString(html) {
		return html instanceof Domm
			? html
			: escapeHtmlTags(html);
	}

	static html(strings, ...values) {
		const html = strings
			.reduce(
				(accum, string, i) => accum + string + transformValue(values[i]),
				'',
			)
			.trim();

		return new Domm(html);
	}

	static dom(...args) {
		return Domm.html(...args).toElement();
	}
}

module.exports = Domm;
