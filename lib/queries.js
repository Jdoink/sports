import { gql } from "@apollo/client";

export const GET_SPORTS_MARKETS = gql`
  query GetMarkets {
    sportsMarkets {
      id
      homeTeam
      awayTeam
      maturity
      odds
      status
    }
  }
`;
