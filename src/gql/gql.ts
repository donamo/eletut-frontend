/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment LifeEventFields on LifeEvent {\n    id\n    title\n    description\n    location\n    color\n    importance\n    gyermekiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    szuloiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    felnottStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    dateValue\n    datePrecision\n    createdAt\n    updatedAt\n  }\n": typeof types.LifeEventFieldsFragmentDoc,
    "\n  query LifeEvents {\n    lifeEvents {\n      ...LifeEventFields\n    }\n  }\n": typeof types.LifeEventsDocument,
    "\n  query TopLifeEventLocations {\n    topLifeEventLocations {\n      location\n      count\n    }\n  }\n": typeof types.TopLifeEventLocationsDocument,
    "\n  query EgoStates {\n    egoStates {\n      gyermeki {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      szuloi {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      felnott {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n    }\n  }\n": typeof types.EgoStatesDocument,
    "\n  mutation CreateLifeEvent($input: CreateLifeEventInput!) {\n    createLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n": typeof types.CreateLifeEventDocument,
    "\n  mutation UpdateLifeEvent($input: UpdateLifeEventInput!) {\n    updateLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n": typeof types.UpdateLifeEventDocument,
    "\n  mutation UpdateLifeEventImportanceAndColor($input: UpdateLifeEventImportanceAndColorInput!) {\n    updateLifeEventImportanceAndColor(input: $input) {\n      ...LifeEventFields\n    }\n  }\n": typeof types.UpdateLifeEventImportanceAndColorDocument,
    "\n  mutation DeleteLifeEvent($id: String!) {\n    deleteLifeEvent(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteLifeEventDocument,
};
const documents: Documents = {
    "\n  fragment LifeEventFields on LifeEvent {\n    id\n    title\n    description\n    location\n    color\n    importance\n    gyermekiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    szuloiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    felnottStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    dateValue\n    datePrecision\n    createdAt\n    updatedAt\n  }\n": types.LifeEventFieldsFragmentDoc,
    "\n  query LifeEvents {\n    lifeEvents {\n      ...LifeEventFields\n    }\n  }\n": types.LifeEventsDocument,
    "\n  query TopLifeEventLocations {\n    topLifeEventLocations {\n      location\n      count\n    }\n  }\n": types.TopLifeEventLocationsDocument,
    "\n  query EgoStates {\n    egoStates {\n      gyermeki {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      szuloi {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      felnott {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n    }\n  }\n": types.EgoStatesDocument,
    "\n  mutation CreateLifeEvent($input: CreateLifeEventInput!) {\n    createLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n": types.CreateLifeEventDocument,
    "\n  mutation UpdateLifeEvent($input: UpdateLifeEventInput!) {\n    updateLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n": types.UpdateLifeEventDocument,
    "\n  mutation UpdateLifeEventImportanceAndColor($input: UpdateLifeEventImportanceAndColorInput!) {\n    updateLifeEventImportanceAndColor(input: $input) {\n      ...LifeEventFields\n    }\n  }\n": types.UpdateLifeEventImportanceAndColorDocument,
    "\n  mutation DeleteLifeEvent($id: String!) {\n    deleteLifeEvent(id: $id) {\n      id\n    }\n  }\n": types.DeleteLifeEventDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LifeEventFields on LifeEvent {\n    id\n    title\n    description\n    location\n    color\n    importance\n    gyermekiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    szuloiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    felnottStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    dateValue\n    datePrecision\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment LifeEventFields on LifeEvent {\n    id\n    title\n    description\n    location\n    color\n    importance\n    gyermekiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    szuloiStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    felnottStates {\n      id\n      name\n      essence\n      innerSentence\n      sortOrder\n    }\n    dateValue\n    datePrecision\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LifeEvents {\n    lifeEvents {\n      ...LifeEventFields\n    }\n  }\n"): (typeof documents)["\n  query LifeEvents {\n    lifeEvents {\n      ...LifeEventFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TopLifeEventLocations {\n    topLifeEventLocations {\n      location\n      count\n    }\n  }\n"): (typeof documents)["\n  query TopLifeEventLocations {\n    topLifeEventLocations {\n      location\n      count\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EgoStates {\n    egoStates {\n      gyermeki {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      szuloi {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      felnott {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n    }\n  }\n"): (typeof documents)["\n  query EgoStates {\n    egoStates {\n      gyermeki {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      szuloi {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n      felnott {\n        id\n        name\n        essence\n        innerSentence\n        sortOrder\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLifeEvent($input: CreateLifeEventInput!) {\n    createLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLifeEvent($input: CreateLifeEventInput!) {\n    createLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLifeEvent($input: UpdateLifeEventInput!) {\n    updateLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLifeEvent($input: UpdateLifeEventInput!) {\n    updateLifeEvent(input: $input) {\n      ...LifeEventFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLifeEventImportanceAndColor($input: UpdateLifeEventImportanceAndColorInput!) {\n    updateLifeEventImportanceAndColor(input: $input) {\n      ...LifeEventFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLifeEventImportanceAndColor($input: UpdateLifeEventImportanceAndColorInput!) {\n    updateLifeEventImportanceAndColor(input: $input) {\n      ...LifeEventFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteLifeEvent($id: String!) {\n    deleteLifeEvent(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteLifeEvent($id: String!) {\n    deleteLifeEvent(id: $id) {\n      id\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;