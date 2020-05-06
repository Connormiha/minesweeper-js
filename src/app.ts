import './style.styl';

import { createSettings } from 'components/common/Settings/settings';
import Field from 'components/common/Field';
import GameStatus from 'components/common/game-status';
import schema, { SchemaType } from 'reducers/schema';
import fieldGenerator, {fieldGeneratorEmpty} from 'helpers/field-generator';
import {
  getCellNeighbours,
  IS_OPENED_BIT_FLAG,
  IS_BOMB_BIT_FLAG,
  IS_FLAG_BIT_FLAG,
  IS_UNKNOWN_BIT_FLAG,
  IS_EVERYTHING_BIT_FLAG,
} from 'helpers/utils';

const createApp = (schema: SchemaType, root: HTMLDivElement): void => {
  const onStart = (): void => {
    const totalCells = schema.game.width * schema.game.height;

    if (
      totalCells > 100000 &&
      !confirm(`Your field includes ${totalCells} cells. It can takes a time for render`)
    ) {
      return;
    }

    schema.game.state = 'in-progress';
    schema.field.showAllBombs = false;
    schema.field.field = fieldGeneratorEmpty(schema.game.width, schema.game.height);
    schema.field.isGenerated = false;

    field.renderAll();
  };

  const settings = createSettings(schema.game, onStart);
  const gameStatus = new GameStatus();
  const field = new Field(
    {
      onClickCell: (id: number): void => {
        if (!schema.field.isGenerated) {
          schema.field.field = fieldGenerator(
            schema.game.width,
            schema.game.height,
            schema.game.minesCount,
            id
          );
          schema.field.isGenerated = true;
        }
        cellOpen(id);
        checkFinish();
      },
      onClickMarkCell: (id: number): void => {
        const cell = schema.field.field[id];

        if (cell & IS_UNKNOWN_BIT_FLAG) {
          updateCell(id, 0, ~IS_UNKNOWN_BIT_FLAG);
        } else if (cell & IS_FLAG_BIT_FLAG) {
          updateCell(id, IS_UNKNOWN_BIT_FLAG, ~IS_FLAG_BIT_FLAG)
          schema.field.flagsCount--;
        } else {
          updateCell(id, IS_FLAG_BIT_FLAG)
          schema.field.flagsCount++;
        }
        checkFinish();
      },
      onClickQuickOpenCell: (id: number): void => {
        const cell = schema.field.field[id];

        if ((cell & IS_OPENED_BIT_FLAG) && ((cell >> 4) !== 0)) {
          let countFlagsAround = 0;
          const neighbours = getCellNeighbours(id, schema.game.width, schema.field.field.length);

          const emptyCells = neighbours.filter((id) => {
            const cell = schema.field.field[id];

            if (cell & IS_FLAG_BIT_FLAG) {
              countFlagsAround++;

              return false;
            }

            if ((cell & (IS_OPENED_BIT_FLAG | IS_UNKNOWN_BIT_FLAG)) === 0) {
              return true;
            }

            return false;
          });

          if (countFlagsAround === cell >> 4) {
            emptyCells.forEach((id) => {
              if ((schema.field.field[id] >> 4) === 0 && !(schema.field.field[id] & IS_BOMB_BIT_FLAG)) {
                openAllowedSiblings(id);
              } else {
                openCellState(id);
              }
            });
          }
        }

        checkFinish();
      }
    },
    schema
  );

  const onFinishGame = (isFail: boolean): void => {
    schema.game.state = isFail ? 'fail' : 'win';
    field.reRenderAll();
  }

  const checkFinish = (): void => {
    const {field, game} = schema;

    if (field.showAllBombs && game.state !== 'fail') {
      onFinishGame(true);
    } else if (
      game.state === 'in-progress' &&
        (
          field.flagsCount + field.openedCount === field.field.length ||
            (
              field.field.length === field.openedCount + game.minesCount &&
                !field.showAllBombs
            )
        )
    ) {
      onFinishGame(false);
    }
  };

  root.appendChild(settings);
  root.appendChild(field.element);
  root.appendChild(gameStatus.element);
  root.appendChild(field.progressElement);

  const cellOpen = (id: number): void => {
    const cell = schema.field.field[id];

    if ((cell >> 4) === 0 && !(cell & IS_BOMB_BIT_FLAG)) {
      openAllowedSiblings(id);
      return;
    }

    openCellState(id);
  };

  const openCellState = (id: number): void => {
    if (schema.field.field[id] & IS_OPENED_BIT_FLAG) {
      return;
    }

    if (schema.field.field[id] & IS_BOMB_BIT_FLAG) {
      schema.field.showAllBombs = true;
    }

    schema.field.openedCount++;
    updateCell(id, IS_OPENED_BIT_FLAG)
  }

  const updateCell = (id: number, add: number, remove = IS_EVERYTHING_BIT_FLAG): void => {
    schema.field.field[id] |= add;
    schema.field.field[id] &= remove;
    field.renderCell(id);
    gameStatus.render({
      minesLeftCount: schema.game.minesCount - schema.field.flagsCount,
      state: schema.game.state
    });
  }

  const openAllowedSiblings = (id: number): void => {
    const width = schema.game.width;
    const {field} = schema.field;
    const size = field.length;
    const visited = new Uint8Array(size);
    const stack: number[] = [id];

    while (stack.length) {
      const currentId = stack.pop();

      if (currentId === undefined) {
        throw Error('currentId is undefined');
      }

      visited[currentId] = 1;

      if (field[currentId] & IS_OPENED_BIT_FLAG) {
        continue;
      }

      updateCell(currentId, IS_OPENED_BIT_FLAG);
      schema.field.openedCount++;

      if ((field[currentId] >> 4) === 0) {
        const neighbours = getCellNeighbours(currentId, width, size);
        for (let i = neighbours.length - 1; i >= 0; i--) {
          if (visited[neighbours[i]]) {
            continue;
          }
          stack.push(neighbours[i]);
        }
      }
    }
  };

  onStart();
}

createApp(schema, document.querySelector('#app') as HTMLDivElement);
