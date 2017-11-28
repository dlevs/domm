import { html, dom } from '.';

const attr = {
	class: 'houses-list',
	title: 'This is a "list".',
};
const items = ['Lannister', 'Stark', 'Targaryen', 'Tyrell'];

const output = html`
<ul ${attr}>
	${items.map(item => (
		`<li>${item}</li>`
	))}
</ul>
`;

describe('html()', () => {
	test('returns same string when no variables are used', () => {
		expect(html`foo bar`).toBe('foo bar');
		expect(html`10`).toBe('10');
	});
	test('trims the ends of strings', () => {
		expect(html`   foo bar	`).toBe('foo bar');
		expect(html`

		10

		`).toBe('10');
	});
});
