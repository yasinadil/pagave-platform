migrate((db) => {
  const collection = new Collection({
    "id": "1jqfje9kayjfh7n",
    "created": "2023-02-16 23:11:23.351Z",
    "updated": "2023-02-16 23:11:23.351Z",
    "name": "userWallets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qztrjqjz",
        "name": "purchases",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "8cyt2aet",
        "name": "subscriptions",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1jqfje9kayjfh7n");

  return dao.deleteCollection(collection);
})
