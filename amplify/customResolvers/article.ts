import { a } from "@aws-amplify/backend";

export const GetArticle = a
  .query()
  .arguments({
    id: a.id().required(),
  })
  .returns(a.ref("Article"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "ArticleTableDataSource",
      entry: "../data/getItem.js",
    })
  );

export const ListArticles = a
  .query()
  .returns(a.ref("ListArticlesResult"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "ArticleTableDataSource",
      entry: "../data/listItems.js",
    })
  );

export const AddArticle = a
  .mutation()
  .arguments({
    id: a.id(),
    title: a.string().required(),
    content: a.string().required(),
    authorId: a.string().required(),
  })
  .returns(a.ref("Article"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "ArticleTableDataSource",
      entry: "../data/addItem.js",
    })
  );

export const UpdateArticle = a
  .mutation()
  .arguments({
    id: a.id().required(),
    title: a.string(),
    content: a.string(),
    authorId: a.string(),
  })
  .returns(a.ref("Article"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "ArticleTableDataSource",
      entry: "../data/updateItem.js",
    })
  );

export const DeleteArticle = a
  .mutation()
  .arguments({
    id: a.id().required(),
  })
  .returns(a.ref("Article"))
  .authorization((allow) => [allow.publicApiKey()])
  .handler(
    a.handler.custom({
      dataSource: "ArticleTableDataSource",
      entry: "../data/deleteItem.js",
    })
  );
