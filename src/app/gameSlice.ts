import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from './store';
import {shuffle} from '../utils/utils'

export interface GameState {
  deck: string[];
  deckRevealed: boolean[]
  gameWon: boolean;
  gameOver: boolean;
  diffuserDiscovered: boolean;
  score: number,
  gamesLost: number,
  username: string,
  leaderboard: User[]
}

const initialState: GameState = {
  deck: shuffle(['😼', '🙅‍♂️', '🔀', '💣', '😼']), 
  deckRevealed: [false, false, false, false, false],
  gameWon: false,
  gameOver: false,
  diffuserDiscovered: false,
  score: 0,
  gamesLost: 0,
  username: "",
  leaderboard: []
};

export const gameSlice = createSlice(
    {
        name:'game',
        initialState,
        reducers : {
            setUsername: (state,action) =>{
                state.username = action.payload.name;
            },
            gameOver: (state) => {
                state.gameOver = true;
                state.gamesLost +=1;
            },
            revealCard: (state,action) => {
                state.deckRevealed[action.payload.index] = true;
            } ,
            restartGame: (state) => {
                state.gameOver = false;
                state.gameWon = false;
                state.diffuserDiscovered = false;
                state.deckRevealed = [false, false, false, false, false];
                state.deck = shuffle(['😼', '🙅‍♂️', '🔀', '💣', '😼'])
            },
            drawCard: (state, action) => {
                const index = action.payload.index;
                const cardType = action.payload.cardType;
                if(state.deck.length > 1) {
                    switch (cardType){
                        case '😼':
                            state.deck = state.deck.filter(
                             (icon,i) => (i !== index)
                            )
                            state.deckRevealed  = state.deckRevealed.filter(
                                (val,i) => (i !== index)
                            )
                            break;

                        case '💣':
                            if(state.diffuserDiscovered) {
                                state.gameWon = true;
                            }
                            else {
                                state.gameOver = true;
                                state.gamesLost += 1;
                            }
                            break;

                        case '🙅‍♂️':
                            state.deck = state.deck.filter(
                                (icon,i) => (i !== index)
                               )
                               state.deckRevealed  = state.deckRevealed.filter(
                                   (val,i) => (i !== index)
                               )
                            state.diffuserDiscovered = true;
                            break;

                        case '🔀':
                            state.gameOver = false;
                            state.gameWon = false;      
                            state.diffuserDiscovered = false;
                            state.deckRevealed = [false, false, false, false, false];
                            state.deck = shuffle(['😼', '🙅‍♂️', '🔀', '💣', '😼'])
                            break;

                        default:
                            state.deck = shuffle(state.deck)
                            break;
                }
                }
                
            }
        },
        extraReducers(builder){
            
            builder.addCase(getLeaderboard.fulfilled, (state, action) => {
                state.leaderboard = action.payload} )
            
            builder.addCase(getLeaderboard.rejected, (state, action) => {
                console.log("getLeaderboard Error",action.error)} )

            builder.addCase(getScore.fulfilled, (state, action) => {
                console.log("getscore", action.payload)
                state.score = action.payload.score} )

            builder.addCase(getScore.rejected, (state, action) => {
                console.log("getScore Error",  action.error) } )

            builder.addCase(updateScore.fulfilled, (state, action) => {
                state.score = action.payload.score} )

            builder.addCase(updateScore.rejected, (state, action) => {
                console.log("getLeaderboard Error",action.error)} )

        }
    }
)

export const getLeaderboard = createAsyncThunk(
    "leaderboard",
    async () => {
        console.log("calling lb")
        const response =  await fetch(import.meta.env.VITE_API_URL+"/leaderboard",{mode: 'cors'})
        return response.json();
    }
)
export const getScore = createAsyncThunk<any, User>(
    "score",
    async (user:User) => {
        console.log("calling gs", JSON.stringify({username:user.username}))
        const response = await fetch(import.meta.env.VITE_API_URL+"/getScore",{method:'POST', body: JSON.stringify({username:user.username, score: user.score})})
        return response.json()
    }
)
export const updateScore = createAsyncThunk<any, User>(
    "updatescore",
    async (user:User) => {
        const response = await fetch(import.meta.env.VITE_API_URL+"/updateScore",{method: 'POST',mode: 'cors', body: JSON.stringify({username:user.username, score:user.score+1})})
        return response.json()
    }
)


export const { gameOver,restartGame,drawCard,revealCard,setUsername } = gameSlice.actions
export default gameSlice.reducer




