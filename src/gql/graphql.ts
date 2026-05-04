/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateLifeEventInput = {
  color?: InputMaybe<LifeEventColor>;
  datePrecision: DatePrecision;
  dateValue: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  felnottStateIds?: InputMaybe<Array<Scalars['String']['input']>>;
  gyermekiStateIds?: InputMaybe<Array<Scalars['String']['input']>>;
  importance: Scalars['Int']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  szuloiStateIds?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export enum DatePrecision {
  Day = 'DAY',
  Month = 'MONTH',
  Year = 'YEAR'
}

export type EgoState = {
  __typename?: 'EgoState';
  category: EgoStateCategory;
  essence: Scalars['String']['output'];
  id: Scalars['String']['output'];
  innerSentence: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type EgoStateCatalog = {
  __typename?: 'EgoStateCatalog';
  felnott: Array<EgoState>;
  gyermeki: Array<EgoState>;
  szuloi: Array<EgoState>;
};

export enum EgoStateCategory {
  Felnott = 'FELNOTT',
  Gyermeki = 'GYERMEKI',
  Szuloi = 'SZULOI'
}

export type LifeEvent = {
  __typename?: 'LifeEvent';
  color?: Maybe<LifeEventColor>;
  createdAt: Scalars['DateTime']['output'];
  datePrecision: DatePrecision;
  dateValue: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  felnottStates: Array<EgoState>;
  gyermekiStates: Array<EgoState>;
  id: Scalars['ID']['output'];
  importance: Scalars['Int']['output'];
  location?: Maybe<Scalars['String']['output']>;
  ownerUserId: Scalars['ID']['output'];
  szuloiStates: Array<EgoState>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum LifeEventColor {
  Black = 'BLACK',
  Blue = 'BLUE',
  Brown = 'BROWN',
  Cyan = 'CYAN',
  Gray = 'GRAY',
  Green = 'GREEN',
  Indigo = 'INDIGO',
  Lime = 'LIME',
  Magenta = 'MAGENTA',
  Orange = 'ORANGE',
  Pink = 'PINK',
  Purple = 'PURPLE',
  Red = 'RED',
  Teal = 'TEAL',
  White = 'WHITE',
  Yellow = 'YELLOW'
}

export type LifeEventLocationSummary = {
  __typename?: 'LifeEventLocationSummary';
  count: Scalars['Int']['output'];
  location: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLifeEvent: LifeEvent;
  deleteLifeEvent: LifeEvent;
  updateLifeEvent: LifeEvent;
  updateLifeEventImportanceAndColor: LifeEvent;
};


export type MutationCreateLifeEventArgs = {
  input: CreateLifeEventInput;
};


export type MutationDeleteLifeEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateLifeEventArgs = {
  input: UpdateLifeEventInput;
};


export type MutationUpdateLifeEventImportanceAndColorArgs = {
  input: UpdateLifeEventImportanceAndColorInput;
};

export type Query = {
  __typename?: 'Query';
  egoStates: EgoStateCatalog;
  lifeEvent: LifeEvent;
  lifeEvents: Array<LifeEvent>;
  me: User;
  topLifeEventLocations: Array<LifeEventLocationSummary>;
};


export type QueryLifeEventArgs = {
  id: Scalars['String']['input'];
};

export type UpdateLifeEventImportanceAndColorInput = {
  color?: InputMaybe<LifeEventColor>;
  id: Scalars['ID']['input'];
  importance?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateLifeEventInput = {
  color?: InputMaybe<LifeEventColor>;
  datePrecision?: InputMaybe<DatePrecision>;
  dateValue?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  felnottStateIds?: InputMaybe<Array<Scalars['String']['input']>>;
  gyermekiStateIds?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  importance?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  szuloiStateIds?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  googleSubject: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LifeEventFieldsFragment = { __typename?: 'LifeEvent', id: string, title: string, description?: string | null, location?: string | null, color?: LifeEventColor | null, importance: number, dateValue: any, datePrecision: DatePrecision, createdAt: any, updatedAt: any, gyermekiStates: Array<{ __typename?: 'EgoState', id: string, name: string, essence: string, innerSentence: string, sortOrder: number }>, szuloiStates: Array<{ __typename?: 'EgoState', id: string, name: string, essence: string, innerSentence: string, sortOrder: number }>, felnottStates: Array<{ __typename?: 'EgoState', id: string, name: string, essence: string, innerSentence: string, sortOrder: number }> } & { ' $fragmentName'?: 'LifeEventFieldsFragment' };

export type LifeEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type LifeEventsQuery = { __typename?: 'Query', lifeEvents: Array<(
    { __typename?: 'LifeEvent' }
    & { ' $fragmentRefs'?: { 'LifeEventFieldsFragment': LifeEventFieldsFragment } }
  )> };

export type TopLifeEventLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopLifeEventLocationsQuery = { __typename?: 'Query', topLifeEventLocations: Array<{ __typename?: 'LifeEventLocationSummary', location: string, count: number }> };

export type EgoStatesQueryVariables = Exact<{ [key: string]: never; }>;


export type EgoStatesQuery = { __typename?: 'Query', egoStates: { __typename?: 'EgoStateCatalog', gyermeki: Array<{ __typename?: 'EgoState', id: string, name: string, essence: string, innerSentence: string, sortOrder: number }>, szuloi: Array<{ __typename?: 'EgoState', id: string, name: string, essence: string, innerSentence: string, sortOrder: number }>, felnott: Array<{ __typename?: 'EgoState', id: string, name: string, essence: string, innerSentence: string, sortOrder: number }> } };

export type CreateLifeEventMutationVariables = Exact<{
  input: CreateLifeEventInput;
}>;


export type CreateLifeEventMutation = { __typename?: 'Mutation', createLifeEvent: (
    { __typename?: 'LifeEvent' }
    & { ' $fragmentRefs'?: { 'LifeEventFieldsFragment': LifeEventFieldsFragment } }
  ) };

export type UpdateLifeEventMutationVariables = Exact<{
  input: UpdateLifeEventInput;
}>;


export type UpdateLifeEventMutation = { __typename?: 'Mutation', updateLifeEvent: (
    { __typename?: 'LifeEvent' }
    & { ' $fragmentRefs'?: { 'LifeEventFieldsFragment': LifeEventFieldsFragment } }
  ) };

export type UpdateLifeEventImportanceAndColorMutationVariables = Exact<{
  input: UpdateLifeEventImportanceAndColorInput;
}>;


export type UpdateLifeEventImportanceAndColorMutation = { __typename?: 'Mutation', updateLifeEventImportanceAndColor: (
    { __typename?: 'LifeEvent' }
    & { ' $fragmentRefs'?: { 'LifeEventFieldsFragment': LifeEventFieldsFragment } }
  ) };

export type DeleteLifeEventMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteLifeEventMutation = { __typename?: 'Mutation', deleteLifeEvent: { __typename?: 'LifeEvent', id: string } };

export const LifeEventFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LifeEventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LifeEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}},{"kind":"Field","name":{"kind":"Name","value":"gyermekiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"szuloiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"felnottStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"datePrecision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LifeEventFieldsFragment, unknown>;
export const LifeEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LifeEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lifeEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LifeEventFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LifeEventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LifeEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}},{"kind":"Field","name":{"kind":"Name","value":"gyermekiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"szuloiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"felnottStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"datePrecision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LifeEventsQuery, LifeEventsQueryVariables>;
export const TopLifeEventLocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TopLifeEventLocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topLifeEventLocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<TopLifeEventLocationsQuery, TopLifeEventLocationsQueryVariables>;
export const EgoStatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EgoStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"egoStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gyermeki"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"szuloi"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"felnott"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}}]}}]}}]} as unknown as DocumentNode<EgoStatesQuery, EgoStatesQueryVariables>;
export const CreateLifeEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLifeEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLifeEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLifeEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LifeEventFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LifeEventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LifeEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}},{"kind":"Field","name":{"kind":"Name","value":"gyermekiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"szuloiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"felnottStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"datePrecision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateLifeEventMutation, CreateLifeEventMutationVariables>;
export const UpdateLifeEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLifeEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLifeEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLifeEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LifeEventFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LifeEventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LifeEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}},{"kind":"Field","name":{"kind":"Name","value":"gyermekiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"szuloiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"felnottStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"datePrecision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateLifeEventMutation, UpdateLifeEventMutationVariables>;
export const UpdateLifeEventImportanceAndColorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLifeEventImportanceAndColor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLifeEventImportanceAndColorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLifeEventImportanceAndColor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LifeEventFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LifeEventFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LifeEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}},{"kind":"Field","name":{"kind":"Name","value":"gyermekiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"szuloiStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"felnottStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"essence"}},{"kind":"Field","name":{"kind":"Name","value":"innerSentence"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateValue"}},{"kind":"Field","name":{"kind":"Name","value":"datePrecision"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateLifeEventImportanceAndColorMutation, UpdateLifeEventImportanceAndColorMutationVariables>;
export const DeleteLifeEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLifeEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLifeEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteLifeEventMutation, DeleteLifeEventMutationVariables>;