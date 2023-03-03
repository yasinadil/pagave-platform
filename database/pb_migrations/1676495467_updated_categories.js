migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ahednu81",
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
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // remove
  collection.schema.removeField("ahednu81")

  return dao.saveCollection(collection)
})
