# OCU_ETH_USD

subgraph: https://thegraph.com/hosted-service/subgraph/urbanisierung/ocu-eth-usd

example query:

```graphql
{
  logMedianPrices(first: 5, orderBy: age, orderDirection: desc) {
    id
    val
    age
  }
}
```
