import './style.styl';

import Settings from 'components/common/Settings';
import Field from 'components/common/Field';
import GameStatus from 'components/common/game-status';
import schema from 'reducers/schema';
import fieldGenerator, {fieldGeneratorEmpty} from 'helpers/field-generator';
import {
  getCellNeighbours,
  IS_OPENED_BIT_FLAG,
  IS_BOMB_BIT_FLAG,
  IS_FLAG_BIT_FLAG,
  IS_UNKNOWN_BIT_FLAG,
  IS_EVERYTHING_BIT_FLAG,
} from 'helpers/utils';

class App {
  private _root: HTMLDivElement;
  private _settings: Settings;
  private _field: Field;
  private _gameStatus: GameStatus;

  constructor(root: HTMLDivElement) {
    this._root = root;
    this._settings = new Settings(schema.game, {
      onStart: (): void => this.onStart()
    });
    this._gameStatus = new GameStatus();
    this._field = new Field(
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
          this._cellOpen(id);
          this._checkFinish();
          this._gameStatus.render({
            minesLeftCount: schema.game.minesCount - schema.field.flagsCount,
            state: schema.game.state
          });
        },
        onClickMarkCell: (id: number): void => {
          const cell = schema.field.field[id];

          if (cell & IS_UNKNOWN_BIT_FLAG) {
            this._updateCell(id, 0, ~IS_UNKNOWN_BIT_FLAG);
          } else if (cell & IS_FLAG_BIT_FLAG) {
            this._updateCell(id, IS_UNKNOWN_BIT_FLAG, ~IS_FLAG_BIT_FLAG)
            schema.field.flagsCount--;
          } else {
            this._updateCell(id, IS_FLAG_BIT_FLAG)
            schema.field.flagsCount++;
          }
          this._checkFinish();
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
                  this._openAllowedSiblings(id);
                } else {
                  this._openCellState(id);
                }
              });
            }
          }

          this._checkFinish();
        }
      },
      schema
    );

    this._root.appendChild(this._settings.element);
    this._root.appendChild(this._field.element);
    this._root.appendChild(this._gameStatus.element);

    this.onStart();
  }

  private onStart(): void {
    schema.game.state = 'in-progress';
    schema.field.field = fieldGeneratorEmpty(schema.game.width, schema.game.height);
    schema.field.isGenerated = false;
    this._field.renderAll();
  }

  private _cellOpen(id: number): void {
    const cell = schema.field.field[id];

    if ((cell >> 4) === 0 && !(cell & IS_BOMB_BIT_FLAG)) {
      this._openAllowedSiblings(id);
      return;
    }

    this._openCellState(id);
  }

  private _openCellState(id: number): void {
    if (schema.field.field[id] & IS_OPENED_BIT_FLAG) {
      return;
    }

    if (schema.field.field[id] & IS_BOMB_BIT_FLAG) {
      schema.field.showAllBombs = true;
    }

    schema.field.openedCount++;
    this._updateCell(id, IS_OPENED_BIT_FLAG)
  }

  private _updateCell(id: number, add: number, remove = IS_EVERYTHING_BIT_FLAG): void {
    schema.field.field[id] |= add;
    schema.field.field[id] &= remove;
    this._field.renderCell(id);
  }

  private _openAllowedSiblings(id: number): void {
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

      this._updateCell(currentId, IS_OPENED_BIT_FLAG);
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
  }

  private _checkFinish(): void {
    const {field, game} = schema;

    if (field.showAllBombs && game.state !== 'fail') {
      this._onFinishGame(true);
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
      this._onFinishGame(false);
    }
  }

  private _onFinishGame(isFail: boolean): void {
    schema.game.state = isFail ? 'fail' : 'win';
    this._field.reRenderAll();
  }
}

new App(document.querySelector('#app') as HTMLDivElement);
