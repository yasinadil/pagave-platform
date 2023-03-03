migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n")

  collection.name = "purchases"

  // remove
  collection.schema.removeField("qztrjqjz")

  // remove
  collection.schema.removeField("8cyt2aet")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yaimsert",
    "name": "purchaseTxHash",
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

  collection.name = "userWallets"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qztrjqjz",
    "name": "purchases",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8cyt2aet",
    "name": "subscriptions",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("yaimsert")

  return dao.saveCollection(collection)
})
