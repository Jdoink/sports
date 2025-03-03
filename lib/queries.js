import { gql } from "@apollo/client";

export const GET_TOP_LIQUIDITY_MARKET = gql`
  query GetTopLiquidityMarket {
    sportsMarkets(first: 1, orderBy: liquidity, orderDirection: desc) {
      id
      homeTeam
      awayTeam
      liquidity
    }
  }
`;
