migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  collection.viewRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  collection.viewRule = ""

  return dao.saveCollection(collection)
})
