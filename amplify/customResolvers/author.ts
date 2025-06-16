import { a } from "@aws-amplify/backend";

export const GetAuthor = a
  .query()
  .arguments({
    id: a.id().required(),
  })
  .returns(a.ref("Author"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "AuthorTableDataSource",
      entry: "../data/getItem.js",
    })
  );

export const ListAuthors = a
  .query()
  .returns(a.ref("ListAuthorsResult"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "AuthorTableDataSource",
      entry: "../data/listItems.js",
    })
  );

export const AddAuthor = a
  .mutation()
  .arguments({
    id: a.id(),
    name: a.string().required(),
  })
  .returns(a.ref("Author"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "AuthorTableDataSource",
      entry: "../data/addItem.js",
    })
  );

export const UpdateAuthor = a
  .mutation()
  .arguments({
    id: a.id().required(),
    name: a.string(),
  })
  .returns(a.ref("Author"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "AuthorTableDataSource",
      entry: "../data/updateItem.js",
    })
  );

export const DeleteAuthor = a
  .mutation()
  .arguments({
    id: a.id().required(),
  })
  .returns(a.ref("Author"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "AuthorTableDataSource",
      entry: "../data/deleteItem.js",
    })
  );
