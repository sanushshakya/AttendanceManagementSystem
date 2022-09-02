/**
 *
 * pick from object required key value pair and alias them if needed
 *
 * @param {Object} object - object from which we pick
 * @param {Array} keys - array of object with { key: "key", alias:"alias"} where key is tee key of the
 *                      object and alias is what to save key as in new object
 * @returns {Object} - with key as aliased key and value from the passed object
 */
exports.pick = (object, keys) =>
  keys.reduce((obj, key) => {
    let currentKey = "";
    let aliasKey = "";
    if (typeof key === "object") {
      if (!key.key) throw new Error("key required");
      currentKey = key.key;
      aliasKey = key.alias ? key.alias : key.key;
    } else {
      if (!key) throw new Error("key required");
      currentKey = key;
      aliasKey = key;
    }
    if (object && Object.prototype.hasOwnProperty.call(object, currentKey)) {
      // eslint-disable-next-line no-param-reassign
      obj[aliasKey] = object[currentKey];
    }
    return obj;
  }, {});
