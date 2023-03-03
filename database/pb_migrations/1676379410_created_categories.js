migrate((db) => {
  const collection = new Collection({
    "id": "p2qzv34dc5bcn6d",
    "created": "2023-02-14 12:56:50.764Z",
    "updated": "2023-02-14 12:56:50.764Z",
    "name": "categories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uenu983w",
        "name": "name",
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
        "id": "1tr1hyvi",
        "name": "subscription",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
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
      },
      {
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
  const collection = dao.findCollectionByNameOrId("p2qzv34dc5bcn6d");

  return dao.deleteCollection(collection);
})
