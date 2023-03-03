migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // remove
  collection.schema.removeField("1tr1hyvi")

  // remove
  collection.schema.removeField("xplglwaq")

  // remove
  collection.schema.removeField("ht5sgphl")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w1lkc2bv",
    "name": "field",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "1ylmebj9xchydnm",
      "cascadeDelete": false,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1tr1hyvi",
    "name": "subscription",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xplglwaq",
    "name": "productPrice",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ht5sgphl",
    "name": "subscriptionPrice",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("w1lkc2bv")

  return dao.saveCollection(collection)
})
