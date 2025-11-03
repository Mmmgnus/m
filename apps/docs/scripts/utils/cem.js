import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Read and parse the Custom Elements Manifest
 * @param {string} componentsDir - Path to components directory
 * @returns {Promise<Object>}
 */
export async function readCEM(componentsDir) {
  const cemPath = join(componentsDir, 'custom-elements.json');
  const content = await readFile(cemPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Extract component information from CEM
 * @param {Object} cem - Custom Elements Manifest
 * @returns {Array<Object>}
 */
export function extractComponents(cem) {
  const components = [];

  for (const module of cem.modules) {
    for (const declaration of module.declarations || []) {
      if (declaration.customElement && declaration.tagName) {
        components.push({
          tagName: declaration.tagName,
          name: declaration.name,
          description: declaration.description || '',
          path: module.path,
          attributes: declaration.attributes || [],
          slots: declaration.slots || [],
          members: declaration.members || [],
          // Examples are now in CEM thanks to our plugin!
          examples: declaration.examples || []
        });
      }
    }
  }

  return components;
}

