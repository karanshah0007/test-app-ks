import { a } from "@aws-amplify/backend";

export const Todo = a.customType({
  id: a.id().required(),
  content: a.string().required(),
  authorId: a.string().required(),
});

export const ListTodosResult = a.customType({
  items: a.ref("Todo").array(),
  nextToken: a.string() || null,
  scannedCount: a.integer(),
});