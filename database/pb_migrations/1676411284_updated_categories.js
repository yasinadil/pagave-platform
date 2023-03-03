migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
