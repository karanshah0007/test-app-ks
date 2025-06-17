import {
  a,
} from '@aws-amplify/backend';

export const Author = a
  .customType({
        authorId: a
    .string()
        .required()
    ,
        name: a
    .string()
        .required()
    ,
        email: a
    .string()
        .required()
    ,
    
  });
