migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // remove
  collection.schema.removeField("23fffhsw")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "23fffhsw",
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
})
