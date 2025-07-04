import {
  a,
} from '@aws-amplify/backend';

export const Author_BK = a.model({
  authorId: a
    .string()
        .required()            .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  name: a
    .string()
        .required()            .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  email: a
    .string()
        .required()            .authorization((allow: any) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
    ]),
  article: a.hasMany('Article', 'authorId'),
})
    .secondaryIndexes((index: any) => [
            index('authorId'),
            index('email'),
          ])
.authorization((allow: any) => [
  allow.publicApiKey().to(['read']),
  allow.authenticated().to(['read']),
]);
