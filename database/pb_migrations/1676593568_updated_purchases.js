migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // remove
  collection.schema.removeField("rflhywmx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "aauywbeg",
    "name": "productID",
    "type": "text",
    "required": true,
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
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rflhywmx",
    "name": "product",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "1ylmebj9xchydnm",
      "cascadeDelete": false,
      "maxSelect": null,
      "displayFields": [
        "id"
      ]
    }
  }))

  // remove
  collection.schema.removeField("aauywbeg")

  return dao.saveCollection(collection)
})
