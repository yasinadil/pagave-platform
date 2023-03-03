migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // update
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // update
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
        "productName"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
