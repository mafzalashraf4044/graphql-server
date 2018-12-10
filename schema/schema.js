const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const books = [
  {name: 'Book 1', genre: 'Genre 1', id: '1', authorId: '1'},
  {name: 'Book 2', genre: 'Genre 2', id: '2', authorId: '2'},
  {name: 'Book 3', genre: 'Genre 3', id: '3', authorId: '3'},
  {name: 'Book 4', genre: 'Genre 4', id: '4', authorId: '1'},
  {name: 'Book 5', genre: 'Genre 5', id: '5', authorId: '2'},
  {name: 'Book 6', genre: 'Genre 6', id: '6', authorId: '3'},
];

const authors = [
  {name: 'Author 1', age: '41', id: '1'},
  {name: 'Author 2', age: '32', id: '2'},
  {name: 'Author 3', age: '58', id: '3'},
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: (parent, args) => {
        // code to get data from the db
        return _.find(authors, {id: parent.authorId});
      },
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        // code to get data from the db
        return _.filter(books, {authorId: parent.id});
      },
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // code to get data from the db
        return _.find(books, {id: args.id});
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        return books;
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // code to get data from the db
        return _.find(authors, {id: args.id});
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (parent, args) => {
        return authors;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});