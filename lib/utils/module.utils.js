const TYPE_COMMON_JS = "commonjs";
const TYPE_MODULE = "module";

const ALLOWED_TYPES = [TYPE_COMMON_JS, TYPE_MODULE];

async function isomorphicImport(path, mode = TYPE_COMMON_JS) {
  switch (mode) {
    case TYPE_MODULE:
      return await import("file://" + path);
    default:
      return require(path);
  }
}

module.exports = {
  TYPE_COMMON_JS,
  TYPE_MODULE,
  ALLOWED_TYPES,
  isomorphicImport,
};
