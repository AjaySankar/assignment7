import ApolloClient from "apollo-boost"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"

const cache = new InMemoryCache()
export default new ApolloClient({
  link: createHttpLink({
    fetchOptions: {
      method: "POST",
    },
  }),
  cache,
  uri: "http://localhost:3000/graphql",
})
