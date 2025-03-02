import { gql } from '@apollo/client';

export const GET_TOP_LIQUIDITY_MARKET = gql`
  {
    sportsMarkets(where: { isResolved: false, hasLiquidity: true }, orderBy: liquidity, orderDirection: desc, first: 1) {
      id
      homeTeam
      awayTeam
      homeOdds
      awayOdds
      liquidity
      gameStartTime
    }
  }
`;
