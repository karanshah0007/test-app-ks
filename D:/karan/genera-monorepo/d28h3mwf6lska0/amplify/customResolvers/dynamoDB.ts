import { a } from '@aws-amplify/backend';
import { addFunction } from '../functions/dynamoDB/add/resource';
import { getFunction } from '../functions/dynamoDB/get/resource';
import { updateFunction } from '../functions/dynamoDB/update/resource';
import { deleteFunction } from '../functions/dynamoDB/delete/resource';
import { listFunction } from '../functions/dynamoDB/list/resource';

export const GetItem = a
  .query()
  .arguments({
    id: a.string().required(),
  })
  .returns(a.json())
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(getFunction));

export const ListItems = a
  .query()
  .returns(a.json())
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(listFunction));

export const AddItem = a
  .mutation()
  .arguments({
    input: a.json().required(),
  })
  .returns(a.json())
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(addFunction));

export const UpdateItem = a
  .mutation()
  .arguments({
    input: a.json().required(),
  })
  .returns(a.json())
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(updateFunction));

export const DeleteItem = a
  .mutation()
  .arguments({
    id: a.string().required(),
  })
  .returns(a.json())
  .authorization((allow) => [allow.publicApiKey()])
  .handler(a.handler.function(deleteFunction));
