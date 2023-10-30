/* A script that uses the documentation.js npm package to generate Markdown
documentation from jsdoc comments in the code. */

import { build, formats } from 'documentation';
import fs from 'fs';

const postProcessLine = (line) => line
    // Reduce heading level of Parameters to avoid it showing up in docusaurus
    // table of content
    .replace('### Parameters', '#### Parameters');

build(['index.js'], {
  sortOrder: ['kind', 'alpha'],
  inferPrivate: '^_'
}).then(formats.md)
  .then(output => {
    // post-process
    const processed = output.split('\n').map(postProcessLine).join('\n');

    fs.mkdirSync('docs', {recursive: true});
    fs.writeFileSync('./docs/index.md', processed);
  });