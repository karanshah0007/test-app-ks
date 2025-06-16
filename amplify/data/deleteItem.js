import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return ddb.remove({ key: { id: ctx.args.id } });
}

export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    if (!ctx.stash.errors) ctx.stash.errors = [];
    ctx.stash.errors.push(error);
    return util.appendError(error.message, error.type, result);
  }
  return result;
}