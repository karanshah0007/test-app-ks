import {
  a,
} from '@aws-amplify/backend';

export const Article_BK = a.model({
  id: a
    .string()
        .required()            .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  title: a
    .string()
        .required()            .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  content: a
    .string()
        .required()            .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  createdAt: a
    .datetime()
                .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  authorId: a
    .string()
        .required()            .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  author: a.belongsTo('Author', 'authorId'),
})
    .secondaryIndexes((index: any) => [
            index('authorId'),
          ])
.authorization((allow: any) => [
  allow.publicApiKey().to(['read']),
  allow.authenticated().to(['read']),
]);
