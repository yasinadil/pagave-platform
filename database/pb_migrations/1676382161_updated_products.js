migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8an2xxvy",
    "name": "urls",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // remove
  collection.schema.removeField("8an2xxvy")

  return dao.saveCollection(collection)
})
