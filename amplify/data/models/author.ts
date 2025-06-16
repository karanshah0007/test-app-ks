import { a } from "@aws-amplify/backend";

export const Author = a.customType({
  id: a.id().required(),
  name: a.string().required(),
});

export const ListAuthorsResult = a.customType({
  items: a.ref("Author").array(),
  nextToken: a.string() || null,
  scannedCount: a.integer(),
});