import { makeSchema } from "nexus";
import { join } from "path";
import * as AllTypes from '../schema/graphql';

export const schema = makeSchema({
    types: AllTypes,
    outputs: {
        typegen: join(__dirname, '.', 'nexus-typegen.ts'),
        schema: join(__dirname, '.', 'schema.graphql'),
    },
});