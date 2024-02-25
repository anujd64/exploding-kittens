import { useDispatch, useSelector } from "react-redux"
import store, { RootState } from "../app/store"
import { drawCard, gameOver, getLeaderboard, restartGame, revealCard, updateScore, getScore, setUsername } from "../app/gameSlice"
import { cn } from "../utils/utils"
import SidebarComponent from "./SidebarComponent"
import { Modal } from "flowbite-react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"

export default function Game() {
  
  const dispatch = useAppDispatch()
  const game = useAppSelector((state: RootState) => state.gameReducer)

  //show the drawn card and execute necessary action
  const revealCardLocal = (index: number) => {
    dispatch(revealCard({ index: index }))

    setTimeout(() => {
      dispatch(drawCard({ cardType: game.deck[index], index: index }))
    }, 800)

    if (game.gameOver) {
      dispatch(gameOver())
    }
  }

  //runs when gameWon (bool) changes if true update the score via api 
  // the api response will be used to update the score
  useEffect(
    () => {
      if(game.gameWon) {
        const user = {username: game.username, score: game.score};
        store.dispatch(updateScore(user))
        store.dispatch(getLeaderboard())
      }
    }
    ,[game.gameWon]
  )
  
  //reset the game
  const handleRestartGame = () => {
    dispatch(restartGame())
  }

  const [openModal, setOpenModal] = useState(false)

  //depends on openModal's state if closed and username entered then call apis and fetch data
  useEffect(() => {
    if (game.username === "") {
      setOpenModal(true)
    } else {
      const user = { username: game.username, score: game.score }

      store.dispatch(getLeaderboard())
      store.dispatch(getScore(user))
    }
  }, [openModal])

  //close the modal
  function onCloseModal() {
    if (game.username !== "") {
      setOpenModal(false)
    }
  }

  //update username
  const onChange = (text: string) => {
    console.log()
    dispatch(setUsername({ name: text }))
  }

  const [showHowTo, setShowHowTo] = useState(false);

  
  return (
    <div className="flex lg:flex-row flex-col">

<div className="flex flex-col items-center justify-center content-center">
        <Modal
          show={openModal}
          size="md"
          onClose={onCloseModal}
          popup
          className="backdrop-blur-lg bg-zinc-400 bg-opacity-40 text-black"
        >
          <Modal.Body>
            <div className="flex flex-col items-center justify-center content-center gap-5 m-auto">
              <input
                className="lg:w-1/6 w-1/2 p-4 m-auto text-xl rounded-2xl"
                placeholder="name"
                type="name"
                defaultChecked
                value={game.username}
                onChange={event => onChange(event.target.value)}
                required
              />
              <button
                className="py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg"
                onClick={onCloseModal}
              >
                Okay!
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div className="lg:w-3/4 w-full h-full flex flex-col items-center content-center gap-5 p-5">
        <h1 className="lg:text-4xl md:text-4xl text-2xl font-bold p-5">Exploding Kittens Game</h1>

        <div className="flex flex-row flex-wrap justify-center gap-4">
          {game.deck &&
            game.deck.map((card, index) => (
              <div className= {cn("group lg:h-40 lg:w-40 w-28 h-28 [perspective:1000px]",game.gameOver || game.gameWon ? "pointer-events-none" : "pointer-events-auto")}>
                <div
                  className={cn(
                    "relative h-full w-full shadow-xl transition-all rounded-xl duration-500 [transform-style:preserve-3d]",
                    game.deckRevealed[index] === true
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  )}
                >
                  <div
                    className="absolute inset-0 lg:p-8 p-4 bg-zinc-600 bg-opacity-10 rounded-xl"
                    onClick={() => revealCardLocal(index)}
                  ></div>
                  <div className="absolute inset-0 h-full w-full cursor-grab rounded-xl bg-zinc-600 lg:p-8 p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="flex flex-col justify-between h-full items-center content-center">
                      <p className="text-[#16453a] m-auto text-6xl font-light leading-5">
                        {game.deckRevealed[index] ? card : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button
          className="py-4 px-3 bg-blue-600 text-white font-semibold rounded-lg"
          onClick={handleRestartGame}
        >
          {game.deck.length === 5 && !game.gameOver
            ? "Start clicking cards!"
            : "Restart Game"}
        </button>
        {game.diffuserDiscovered && (
          <p className="font-semibold text-2xl">
            You found a bomb diffuser! 🙅‍♂️
          </p>
        )}

        {game.gameOver && <p className="font-bold text-3xl">Game Over!</p>}

        {game.gameWon && <p className="font-bold text-3xl"> You Won!</p>}

        <div className="flex content-center flex-col">
          <p className="text-center bg-gray-200 rounded-lg p-3 select-none w-fit self-center drop-shadow-xl" onClick={()=>{setShowHowTo(!showHowTo)} }>How to Play!</p>
          <ul className= {cn("border p-4 rounded-lg m-4",showHowTo ? "visible" : "hidden")}>
            <li>Click on any of the cards and it will be revealed</li>
            <li>If the card is:</li>
            <li>😼 It will be removed from the deck</li>
            <li>💣 You lose, restart the game</li>
            <li>🙅‍♂️ If found before the bomb, you win</li>
            <li>🔀 Resets the game</li>
          </ul>
        </div>
      </div>
      <SidebarComponent />
    </div>
  )
}