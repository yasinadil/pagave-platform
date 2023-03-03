migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("2wqqcjljwhol7io");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "2wqqcjljwhol7io",
    "created": "2023-02-16 22:00:26.977Z",
    "updated": "2023-02-16 22:00:26.977Z",
    "name": "subscriptions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tnnqepss",
        "name": "field",
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
})
