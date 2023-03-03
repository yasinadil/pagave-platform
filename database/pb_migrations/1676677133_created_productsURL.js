migrate((db) => {
  const collection = new Collection({
    "id": "hb197ao8erk1ez5",
    "created": "2023-02-17 23:38:53.677Z",
    "updated": "2023-02-17 23:38:53.677Z",
    "name": "productsURL",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "es5sebg1",
        "name": "urls",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("hb197ao8erk1ez5");

  return dao.deleteCollection(collection);
})
