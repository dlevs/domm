const H = require('.');

// TODO: test betterTypeOf

describe('html()', () => {
	describe('basic functionality', () => {
		test('returns same string when no variables are used', () => {
			expect(H.markup`foo bar`.toString()).toBe('foo bar');
			expect(H.markup`10`.toString()).toBe('10');
		});
		test('trims the ends of strings', () => {
			expect(H.markup`   foo bar	`.toString()).toBe('foo bar');
			expect(H.markup`

			10

			`.toString()).toBe('10');
		});
	});
	describe('stringifying behavior', () => {
		test('stringifies attribute objects', () => {
			const attr = {
				class: 'foo',
				title: 'An attribute with "quotes".',
			};
			const actual = H.markup`<div ${attr}></div>`.toString();
			const expected = '<div class="foo" title="An attribute with \\"quotes\\"."></div>';

			expect(actual).toBe(expected);
		});
		test('stringifies booleans', () => {
			expect(H.markup`<div>${false}</div>`.toString()).toBe('<div>false</div>');
			expect(H.markup`<div>${true}</div>`.toString()).toBe('<div>true</div>');
		});
		test('stringifies null values', () => {
			expect(H.markup`<div>${undefined}</div>`.toString()).toBe('<div></div>');
			expect(H.markup`<div>${null}</div>`.toString()).toBe('<div>null</div>');
		});
		test('stringifies numbers', () => {
			expect(H.markup`<div>${10}</div>`.toString()).toBe('<div>10</div>');
			expect(H.markup`<div>${-10}</div>`.toString()).toBe('<div>-10</div>');
		});
		test('stringifies arrays of strings', () => {
			const items = ['foo', 'bar', 'baz'];
			const actual = H.markup`<div>${items}</div>`.toString();
			const expected = '<div>foobarbaz</div>';

			expect(actual).toBe(expected);
		});
		test('stringifies DOM elements', () => {
			const div = document.createElement('div');
			const h1 = document.createElement('h1');
			h1.textContent = 'Hello World';
			h1.title = 'foo';
			div.appendChild(h1);

			const actual = H.markup`<main>${div}</main>`.toString();
			const expected = '<main><div><h1 title="foo">Hello World</h1></div></main>';

			expect(actual).toBe(expected);
		});
		test('stringifies NodeLists and arrays of nodes', () => {
			document.body.innerHTML = `
				<ul>
					<li>Foo</li>
					<li>Bar</li>
					<li>Baz</li>
				</ul>
			`;

			const elems = document.querySelectorAll('li');
			const actual1 = H.markup`<main>${elems}</main>`.toString();
			const actual2 = H.markup`<main>${Array.from(elems)}</main>`.toString();
			const expected = '<main><li>Foo</li><li>Bar</li><li>Baz</li></main>';

			expect(actual1).toBe(expected);
			expect(actual2).toBe(expected);
		});
	});
	describe('html escaping', () => {
		test('escapes markup in variables', () => {
			const variable = '<b>Hello world!</b>';
			const actual = H.markup`<div>${variable}</div>`.toString();
			const expected = '<div>&lt;b&gt;Hello world!&lt;/b&gt;</div>';

			expect(actual).toBe(expected);
		});
		test('escapes markup in variable lists', () => {
			const items = ['foo', 'bar', 'baz'];
			const actual = H.markup`<ul>${items.map(item => `<li>${item}</li>`)}</ul>`.toString();
			const expected = '<ul>&lt;li&gt;foo&lt;/li&gt;&lt;li&gt;bar&lt;/li&gt;&lt;li&gt;baz&lt;/li&gt;</ul>';

			expect(actual).toBe(expected);
		});
		test('can accept unescaped HTML variables', () => {
			const variable = H.markup`<b>Hello world!</b>`;
			const actual = H.markup`<div>${variable}</div>`.toString();
			const expected = '<div><b>Hello world!</b></div>';

			expect(actual).toBe(expected);
		});
		test('can accept unescaped HTML variables in lists', () => {
			const items = ['foo', 'bar', 'baz'];
			const actual = H.markup`<ul>${items.map(item => H.markup`<li>${item}</li>`)}</ul>`.toString();
			const expected = '<ul><li>foo</li><li>bar</li><li>baz</li></ul>';

			expect(actual).toBe(expected);
		});
		test('can use the main constructor to unsafely display unescaped variables', () => {
			const variable = '<b>Hello world!</b>';
			const actual = H.markup`<div>${new H(variable)}</div>`.toString();
			const expected = '<div><b>Hello world!</b></div>';

			expect(actual).toBe(expected);
		});
	});
});

describe('dom()', () => {
	test('returns a dom node', () => {
		const elem = H.dom`<div title="foo"></div>`;
		expect(elem instanceof HTMLElement).toBe(true);
		expect(elem.tagName).toBe('DIV');
		expect(elem.title).toBe('foo');
	});
	test('returns a node list for multiple elements', () => {
		const elems = H.dom`
			<a href="/">Home</a>
			<a href="/about">About</a>
		`;
		expect(elems instanceof NodeList).toBe(true);
		expect(elems.length).toBe(3);

		// Link 1
		expect(elems[0].tagName).toBe('A');
		expect(elems[0].href).toBe('/');
		expect(elems[0].textContent).toBe('Home');

		// Whitespace between the links
		expect(elems[1].nodeName).toBe('#text');

		// Link 2
		expect(elems[2].tagName).toBe('A');
		expect(elems[2].href).toBe('/about');
		expect(elems[2].textContent).toBe('About');
	});
});
