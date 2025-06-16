import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Amplify } from "aws-amplify";

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "https://o2za37omqfgh5igzanzrbuawaa.appsync-api.us-east-1.amazonaws.com/graphql",
      region: "us-east-1",
      defaultAuthMode: "apiKey",
      apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "da2-zdqko5rkjbhx7ecp27sctftxuy",
    },
  },
});

export const client = generateClient<Schema>();

// Types
export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface Author {
  id: string;
  name: string;
}

export interface Todo {
  id: string;
  content: string;
  authorId: string;
}

// Article Operations
export const listArticles = /* GraphQL */ `
  query ListArticles {
    ListArticles {
      nextToken
      scannedCount
      items {
        id
        title
        content
        authorId
      }
    }
  }
`;

export const getArticle = /* GraphQL */ `
  query GetArticle($id: ID!) {
    GetArticle(id: $id) {
      id
      title
      content
      authorId
    }
  }
`;

export const addArticle = /* GraphQL */ `
  mutation AddArticle($title: String!, $content: String!, $authorId: String!) {
    AddArticle(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      authorId
    }
  }
`;

export const updateArticle = /* GraphQL */ `
  mutation UpdateArticle($id: ID!, $title: String!, $content: String!, $authorId: String!) {
    UpdateArticle(id: $id, title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      authorId
    }
  }
`;

export const deleteArticle = /* GraphQL */ `
  mutation DeleteArticle($id: ID!) {
    DeleteArticle(id: $id) {
      id
    }
  }
`;

// Author Operations
export const listAuthors = /* GraphQL */ `
  query ListAuthors {
    ListAuthors {
      nextToken
      scannedCount
      items {
        id
        name
      }
    }
  }
`;

export const getAuthor = /* GraphQL */ `
  query GetAuthor($id: ID!) {
    GetAuthor(id: $id) {
      id
      name
    }
  }
`;

export const addAuthor = /* GraphQL */ `
  mutation AddAuthor($name: String!) {
    AddAuthor(name: $name) {
      id
      name
    }
  }
`;

export const updateAuthor = /* GraphQL */ `
  mutation UpdateAuthor($id: ID!, $name: String!) {
    UpdateAuthor(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const deleteAuthor = /* GraphQL */ `
  mutation DeleteAuthor($id: ID!) {
    DeleteAuthor(id: $id) {
      id
    }
  }
`;

// Todo Operations
export const listTodos = /* GraphQL */ `
  query ListTodos {
    ListTodos {
      nextToken
      scannedCount
      items {
        id
        content
        authorId
      }
    }
  }
`;

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    GetTodo(id: $id) {
      id
      content
      authorId
    }
  }
`;

export const addTodo = /* GraphQL */ `
  mutation AddTodo($content: String!, $authorId: String!) {
    AddTodo(content: $content, authorId: $authorId) {
      id
      content
      authorId
    }
  }
`;

export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo($id: ID!, $content: String!, $authorId: String!) {
    UpdateTodo(id: $id, content: $content, authorId: $authorId) {
      id
      content
      authorId
    }
  }
`;

export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo($id: ID!) {
    DeleteTodo(id: $id) {
      id
    }
  }
`; 