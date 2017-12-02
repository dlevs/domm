## What
Domm is a small library to create safe HTML and DOM nodes using ES6 template literals.

## Why
It's lightweight and relies on native JS functionality. For anything non-trivial, this doesn't compete with a real template language like [pug](https://www.npmjs.com/package/pug), or a library like [react](https://www.npmjs.com/package/react).

## Installation
```bash
npm install --save domm
```

## Usage
### Basic
```javascript
const D = require('domm');

D.html`<h1>Hello World!</h1>`;
// => '<h1>Hello World!</h1>'

D.dom`<h1>Hello World!</h1>`;
// => new instance of <HTMLHeadingElement>

D.dom`
    <a href="/">Home</a>
    <a href="/about">About</a>
`;
// => new instance of <NodeList> containing 2 links
```

### Variable interpolation
```javascript
// String
const headingText = 'Houses';

// Object
const headingAttrs = { class: 'heading-main' };

// Array
const names = ['Lannister', 'Stark', 'Tyrell'];

// Element
const backLink = document.querySelector('.js-link-back');

D.html`
    <div>
        <h1 ${headingAttrs}>${headingText}</h1>
        <ul>
            ${names.map(names => D.html`<li>${name}</li>`)}
        </ul>
        ${backLink}
    </div>
`
// =>
// <div>
//     <h1 class="heading-main">Houses</h1>
//     <ul>
//         <li>Lannister</li><li>Stark</li><li>Tyrell</li>
//     </ul>
//     <a class="js-link-back" href="/">Back to home</a>
// </div>
```

Note that the list of names required `D.html` to be used on the inner template literal. Without this, the HTML in the list would have been escaped:

```javascript
"&lt;li&gt;Lannister&lt;/li&gt;&lt;li&gt;Stark&lt;/li&gt;&lt;li&gt;Tyrell&lt;/li&gt;"
```

All strings that are interpolated are escaped in this way. To dangerously escape a variable that is not defined via a template literal, use the `D` constructor:

```javascript
const title = someExternalFunctionForGettingTitle();

D.dom`<h1>${new D(title)}</h1>`
```
