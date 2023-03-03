migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6hdvajyq",
    "name": "questionnaire",
    "type": "url",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // remove
  collection.schema.removeField("6hdvajyq")

  return dao.saveCollection(collection)
})
