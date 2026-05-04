import { graphql } from "../gql";

export const LIFE_EVENT_FIELDS = graphql(`
  fragment LifeEventFields on LifeEvent {
    id
    title
    description
    location
    color
    importance
    gyermekiStates {
      id
      name
      essence
      innerSentence
      sortOrder
    }
    szuloiStates {
      id
      name
      essence
      innerSentence
      sortOrder
    }
    felnottStates {
      id
      name
      essence
      innerSentence
      sortOrder
    }
    dateValue
    datePrecision
    createdAt
    updatedAt
  }
`);

export const LIFE_EVENTS_QUERY = graphql(`
  query LifeEvents {
    lifeEvents {
      ...LifeEventFields
    }
  }
`);

export const TOP_LIFE_EVENT_LOCATIONS_QUERY = graphql(`
  query TopLifeEventLocations {
    topLifeEventLocations {
      location
      count
    }
  }
`);

export const EGO_STATES_QUERY = graphql(`
  query EgoStates {
    egoStates {
      gyermeki {
        id
        name
        essence
        innerSentence
        sortOrder
      }
      szuloi {
        id
        name
        essence
        innerSentence
        sortOrder
      }
      felnott {
        id
        name
        essence
        innerSentence
        sortOrder
      }
    }
  }
`);

export const CREATE_LIFE_EVENT_MUTATION = graphql(`
  mutation CreateLifeEvent($input: CreateLifeEventInput!) {
    createLifeEvent(input: $input) {
      ...LifeEventFields
    }
  }
`);

export const UPDATE_LIFE_EVENT_MUTATION = graphql(`
  mutation UpdateLifeEvent($input: UpdateLifeEventInput!) {
    updateLifeEvent(input: $input) {
      ...LifeEventFields
    }
  }
`);

export const UPDATE_LIFE_EVENT_IMPORTANCE_AND_COLOR_MUTATION = graphql(`
  mutation UpdateLifeEventImportanceAndColor($input: UpdateLifeEventImportanceAndColorInput!) {
    updateLifeEventImportanceAndColor(input: $input) {
      ...LifeEventFields
    }
  }
`);

export const DELETE_LIFE_EVENT_MUTATION = graphql(`
  mutation DeleteLifeEvent($id: String!) {
    deleteLifeEvent(id: $id) {
      id
    }
  }
`);
