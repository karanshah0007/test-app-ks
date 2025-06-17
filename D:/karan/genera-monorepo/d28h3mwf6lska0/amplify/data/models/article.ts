import {
  a,
} from '@aws-amplify/backend';

export const Article = a
  .customType({
        id: a
    .string()
        .required()
    ,
        title: a
    .string()
        .required()
    ,
        content: a
    .string()
        .required()
    ,
        createdAt: a
    .datetime()
    ,
        authorId: a
    .string()
        .required()
    ,
    
  });
