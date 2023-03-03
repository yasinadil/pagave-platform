migrate((db) => {
  const collection = new Collection({
    "id": "1ylmebj9xchydnm",
    "created": "2023-02-14 12:59:40.099Z",
    "updated": "2023-02-14 12:59:40.099Z",
    "name": "products",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "eksyj9pb",
        "name": "productName",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": 3,
          "max": 20,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "t06i799j",
        "name": "subscription",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "vyxa6vyt",
        "name": "subscriptionPrice",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null
        }
      },
      {
        "system": false,
        "id": "ouufnrcc",
        "name": "productPrice",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1ylmebj9xchydnm");

  return dao.deleteCollection(collection);
})
