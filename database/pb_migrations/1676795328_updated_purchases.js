migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  // remove
  collection.schema.removeField("hxxvbxyl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ivab2vgg",
    "name": "productID",
    "type": "relation",
    "required": true,
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
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

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

  // remove
  collection.schema.removeField("ivab2vgg")

  return dao.saveCollection(collection)
})
