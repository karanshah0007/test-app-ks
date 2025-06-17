import {
  a,
} from '@aws-amplify/backend';

export const CustomTable = a
  .customType({
        id: a
    .string()
    ,
        name: a
    .string()
    ,
    
  });
