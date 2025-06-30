import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


console.log('GraphQL API:', process.env.REACT_APP_GRAPHQL_API);
// Create HTTP link using the backend GraphQL API
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_API || 'http://localhost:4000/graphql',
  credentials: 'include', // allows sending cookies with cross-origin requests
});

// Add Authorization header if token exists
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
