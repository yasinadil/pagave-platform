migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  collection.listRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  collection.listRule = null

  return dao.saveCollection(collection)
})
