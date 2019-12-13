const { diff } = require('deep-object-diff');

const compareObjects = (o1, o2, fields) => {
  if (!fields) {
    return diff(o1, o2);
  }

  const p1 = {};
  const p2 = {};
  fields.forEach(field => {
    if (o1[field]) {
      p1[field] = o1[field];
    }
    if (o2[field]) {
      p2[field] = o2[field];
    }
  });

  return diff(p1, p2);
};

module.exports = { compareObjects };
