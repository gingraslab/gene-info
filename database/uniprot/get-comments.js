const parseDescription = require('./parse-description');

const parseObjectEntry = entry => (
  typeof entry === 'object' ? entry._ : entry
);

const getComments = (comments) => {
  if (comments && Array.isArray(comments)) {
    return comments.reduce((accum, comment) => {
      let localizations;
      switch (comment.$.type) {
        case 'function':
          if (!accum.description) {
            return {
              ...accum,
              description: parseDescription(parseObjectEntry(comment.text[0])),
            };
          }
          return accum;
        case 'subcellular location':
          if (comment.subcellularLocation) {
            localizations = comment.subcellularLocation.reduce((accumLoc, localization) => (
              [
                ...accumLoc,
                ...localization.location.map(subLocalization => parseObjectEntry(subLocalization)),
              ]
            ), []);
          } else {
            localizations = [];
          }
          return {
            ...accum,
            localization: [...accum.localization, ...localizations],
          };
        default:
          return accum;
      }
    }, { description: '', localization: [] });
  }
  return { description: '', localization: [] };
};

module.exports = getComments;
