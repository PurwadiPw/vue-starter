import isObject from 'lodash/isObject'

export const renameKeys = (node, keysMaps) => {
  if(!isObject(node)) return node
  if(Array.isArray(node)) return node.map(item => renameKeys(item, keysMaps))

  return Object.entries(node).reduce((result, [key, value]) => {
    const newKey = keysMaps[key] || key;
    return {
      ...result,
      [newKey]: renameKeys(value, keysMaps)
    };
  }, {});
}
