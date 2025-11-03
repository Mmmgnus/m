/**
 * Custom Elements Manifest Analyzer Plugin
 * Captures @example JSDoc tags and adds them to the manifest
 */

export function examplesPlugin() {
  return {
    name: 'examples-plugin',
    
    /**
     * Analyze phase - extract examples from JSDoc
     */
    analyzePhase({ ts, node, moduleDoc }) {
      // Only process class declarations with JSDoc
      if (!ts.isClassDeclaration(node)) {
        return;
      }

      const className = node.name?.getText();
      if (!className) {
        return;
      }

      // Get JSDoc comments
      const jsDocTags = ts.getJSDocTags(node);
      const exampleTags = jsDocTags.filter(tag => tag.tagName.getText() === 'example');

      if (exampleTags.length === 0) {
        return;
      }

      // Find the corresponding class declaration in the module
      const classDeclaration = moduleDoc?.declarations?.find(
        declaration => declaration.name === className
      );

      if (!classDeclaration) {
        return;
      }

      // Extract examples from JSDoc
      const examples = exampleTags.map(tag => {
        const commentText = tag.comment || '';
        const text = typeof commentText === 'string' 
          ? commentText 
          : commentText.map(part => part.text).join('');

        return parseExample(text);
      }).filter(example => example.code); // Only include if there's code

      // Add examples to the declaration
      if (examples.length > 0) {
        classDeclaration.examples = examples;
      }
    }
  };
}

/**
 * Parse example text to extract title, description, and code
 * @param {string} text - Raw example text from JSDoc
 * @returns {Object}
 */
function parseExample(text) {
  const lines = text.split('\n');
  let title = '';
  let description = '';
  let code = '';
  let inCodeBlock = false;
  let codeLines = [];
  let descriptionLines = [];

  for (const line of lines) {
    // Check for title (line starting with #)
    if (line.trim().startsWith('#') && !title) {
      title = line.trim().substring(1).trim();
      continue;
    }

    // Check for code block markers
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
      } else {
        inCodeBlock = false;
        code = codeLines.join('\n').trim();
      }
      continue;
    }

    // Collect code or description
    if (inCodeBlock) {
      codeLines.push(line);
    } else if (line.trim()) {
      descriptionLines.push(line.trim());
    }
  }

  // Join description lines
  if (descriptionLines.length > 0) {
    description = descriptionLines.join(' ');
  }

  return {
    title: title || 'Example',
    description: description || '',
    code: code || text.trim()
  };
}

export default examplesPlugin;
