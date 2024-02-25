import { RootState } from "../app/store"
import { cn } from "../utils/utils"
import { useAppSelector } from "../app/hooks"

export default function SidebarComponent() {
  const game = useAppSelector((state: RootState) => state.gameReducer)

  return (
    <div className="lg:w-1/4 w-full h-full flex flex-col items-center content-center justify-center gap-3">
      <div className="flex flex-col my-2 w-4/5 p-4 content-center items-center gap-2 text-xl drop-shadow-xl rounded-lg bg-green-200">
        <div className="text-3xl font-bold">{game.username}'s stats</div>
        <div>Games Won: {game.score}</div>
        <div>Games Lost: {game.gamesLost}</div>
      </div>
      <div className="flex flex-col w-4/5 text-center drop-shadow-xl rounded-lg bg-blue-200 p-5">
        <p className="text-3xl font-semibold pb-5">Leaderboard</p>
        {game.leaderboard.map((user, index) => (
          <div
            className="mx-8 my-2 p-2 rounded-md flex flex-row text-center bg-zinc-200"
            key={index}
          >
            <p className="w-1/2"> {user.username} </p>:{" "}
            <p className="w-1/2">{user.score}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
