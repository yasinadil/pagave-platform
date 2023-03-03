migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u6lqjyqm",
    "name": "walletAddress",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // remove
  collection.schema.removeField("u6lqjyqm")

  return dao.saveCollection(collection)
})
