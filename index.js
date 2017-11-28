const escapeAttribute = attribute => attribute.replace(/"/g, '\\"');

const transformValue = (value) => {
	if (value instanceof Array) {
		return value.join('');
	}

	if (value && typeof value === 'object') {
		return Object
			.keys(value)
			.map(key => `${key}="${escapeAttribute(value[key])}"`)
			.join(' ');
	}

	return value || '';
};

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

const html = (strings, ...values) => strings
	.reduce(
		(accum, string, i) => accum + string + transformValue(values[i]),
		'',
	)
	.trim();

const dom = (...args) => htmlToDom(html(...args));

module.exports = { html, dom };
