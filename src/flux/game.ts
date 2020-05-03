import { AnyAction } from 'redux';
import schema from 'reducers/schema';

import {
  GAME_SET_WIDTH, GAME_SET_HEIGHT, GAME_SET_MINES_COUNT, GAME_START,
  GAME_RESET, GAME_FINISH,
} from 'flux/constants';
import type {GameType} from 'flux/types';

const getDefaultState = (): GameType =>
  schema.game;

export const start = (): AnyAction =>
  ({type: GAME_START});

export const finish = (isFail: boolean): AnyAction =>
  ({type: GAME_FINISH, isFail});

export const reset = (): AnyAction =>
  ({type: GAME_RESET});

export default (state: GameType = getDefaultState(), {type, value, isFail}: AnyAction): void => {
  switch (type) {
    case GAME_RESET:
      return {...state, state: 'not-started'};

    case GAME_FINISH:
      return {...state, state: isFail ? 'fail' : 'win'};

    case GAME_START:
      return {...state, state: 'in-progress'};
  }
};
