import { Navigate, useParams } from "react-router-dom"
import { useStores } from "../../stores/useStores";
import GameDisplay from "../Randomizer/GameDisplay/GameDisplay";

const GameDetails = () => {
  const { gameId } = useParams();
  const { dbStore } = useStores();

  const game = dbStore.getGameById(Number(gameId) ?? 0);
  if (!game) { return <Navigate to={'/404'} />; }
  return <GameDisplay game={game} />
}
export default GameDetails