migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fgibgg0z",
    "name": "thumbnail",
    "type": "url",
    "required": true,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm")

  // remove
  collection.schema.removeField("fgibgg0z")

  return dao.saveCollection(collection)
})
