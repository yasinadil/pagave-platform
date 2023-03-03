migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "emacxezr",
    "name": "description",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // remove
  collection.schema.removeField("emacxezr")

  return dao.saveCollection(collection)
})
