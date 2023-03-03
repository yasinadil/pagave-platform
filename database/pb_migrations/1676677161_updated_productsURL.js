migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hb197ao8erk1ez5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wykzcqot",
    "name": "productid",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "1ylmebj9xchydnm",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hb197ao8erk1ez5")

  // remove
  collection.schema.removeField("wykzcqot")

  return dao.saveCollection(collection)
})
