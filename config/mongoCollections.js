//mongoCollection
const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
  users: getCollectionFn("users"),
  resume: getCollectionFn("resume"),
  contactus: getCollectionFn("contactus"),
  cv: getCollectionFn("cv"),
  coverletter: getCollectionFn("coverletter")
};
