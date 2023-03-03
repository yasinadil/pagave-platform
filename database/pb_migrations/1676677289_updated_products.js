migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fpjddhlt",
    "name": "videos",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // remove
  collection.schema.removeField("fpjddhlt")

  return dao.saveCollection(collection)
})
