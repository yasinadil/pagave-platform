migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // remove
  collection.schema.removeField("6rjizvg2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hxxvbxyl",
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
    "id": "6rjizvg2",
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
  collection.schema.removeField("hxxvbxyl")

  return dao.saveCollection(collection)
})
