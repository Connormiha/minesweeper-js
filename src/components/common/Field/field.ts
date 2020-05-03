import Cell from 'components/common/Cell';
import bem from 'bem-css-modules';
import {
  IS_OPENED_BIT_FLAG,
  IS_FLAG_BIT_FLAG,
  IS_UNKNOWN_BIT_FLAG,
} from 'helpers/utils';

import type {CellType} from 'flux/types';
import { SchemaType } from 'reducers/schema';

import style from './field.styl';

const b = bem(style);

const KEY_ENTER = 13;
const KEY_SPACE = 32;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const allowedKeys = [KEY_ENTER, KEY_SPACE, KEY_DOWN, KEY_UP, KEY_LEFT, KEY_RIGHT];

type PropsType = {
    onClickCell: (id: number) => void;
    onClickMarkCell: (id: number) => void;
    onClickQuickOpenCell: (id: number) => void;
};

export default class Field {
  public element: HTMLDivElement;
  private _isLockedEvents: boolean;
  private _actions: PropsType;
  private _gameState: SchemaType;
  private _timer!: number;
  private _cells: Cell[];

  constructor(actions: PropsType, gameState: SchemaType) {
    this._actions = actions;
    this._isLockedEvents = false;
    this._gameState = gameState;
    this._cells = [];

    this.element = document.createElement('div');
    this.element.className = b();

    this.element.addEventListener('click', this);
    this.element.addEventListener('contextmenu', this);
    this.element.addEventListener('dblclick', this);
    this.element.addEventListener('mouseup', this);
    this.element.addEventListener('keydown', this);
  }

  public renderAll(): void {
    const fragment = document.createDocumentFragment();
    this._cells = [];

    for (let i = 0; i < this._gameState.field.field.length; i++) {
      this._cells[i] = new Cell();
      this._cells[i].render(this._gameState.field.field[i], this._gameState.field.showAllBombs);
      fragment.appendChild(this._cells[i].element);
    }

    this.element.innerHTML = '';
    this.element.style.width = `${this._gameState.game.width * 34}px`;
    this.element.appendChild(fragment);
  }

  public renderCell(id: number): void {
    this.element.className = b({
      locked: this._gameState.field.showAllBombs || this._gameState.game.state === 'win'
    });
    this._cells[id].render(this._gameState.field.field[id], this._gameState.field.showAllBombs);
  }

  public handleEvent(e: MouseEvent | KeyboardEvent): void {
    e.preventDefault();
    if (this._isLockedEvents) {
      return;
    }

    const current = e.target;

    if (!(current instanceof HTMLButtonElement)) {
      return;
    }

    const parent = current.parentElement;

    if (!parent) {
      return;
    }

    const id = Array.prototype.indexOf.call(parent.children, current);

    switch (e.type) {
      case 'click': {
        this._hanldeClick(e as MouseEvent, id);
        break;
      }
      case 'dblclick': {
        this._hanldeDoubleClick(id);
        break;
      }
      case 'contextmenu': {
        this._handleContextMenu(id);
        break;
      }
      case 'mouseup': {
        this._handleMouseUp(e as MouseEvent, id);
        break;
      }
      case 'keydown': {
        this._handleKeyPress(e as KeyboardEvent);
        break;
      }
    }
  }

  private _hanldeClick(e: MouseEvent, id: number): void {
    this._openCellEvent(id, e.ctrlKey || e.altKey);
  }

  private _hanldeDoubleClick(id: number): void {
    this._quickOpen(id);
  }

  private _handleContextMenu(id: number): void {
    if (this._getCell(id) & IS_OPENED_BIT_FLAG) {
      this._actions.onClickQuickOpenCell(id);
    } else {
      this._actions.onClickMarkCell(id);
    }
  }

  private _handleMouseUp(e: MouseEvent, id: number): void {
    if (e.which === 2) {
      this._quickOpen(id);
    }
  }

  private _handleKeyPress(e: KeyboardEvent): void {
    const {keyCode} = e;

    if (!allowedKeys.includes(keyCode)) {
      return;
    }

    const current = document.activeElement;

    if (!(current instanceof HTMLButtonElement)) {
      return;
    }

    const parent = current.parentElement;

    if (!parent) {
      return;
    }

    e.preventDefault();
    this._lockEvents();
    clearTimeout(this._timer);

    const id = Array.prototype.indexOf.call(parent.children, current);
    let nextId = -1;

    switch (keyCode) {
      case KEY_SPACE:
        this._handleContextMenu(id);
        break;

      case KEY_ENTER:
        this._openCellEvent(id, false);
        break;

      case KEY_LEFT:
        nextId = this._getPrevAvailableId(id - 1);
        break;

      case KEY_RIGHT:
        nextId = this._getNextAvailableId(id + 1);
        break;

      case KEY_UP:
        nextId = this._getPrevAvailableId(id - this._gameState.game.width);
        break;

      case KEY_DOWN:
        nextId = this._getNextAvailableId(id + this._gameState.game.width);
        break;
    }

    if (parent.children[nextId]) {
      (parent.children[nextId] as HTMLButtonElement).focus();
    }

    this._timer = setTimeout(() => this._unlockEvents(), 100);
  }

  private _quickOpen(id: number): void {
    const cell = this._getCell(id);

    if ((cell & IS_OPENED_BIT_FLAG) && (cell >> 8) !== 0) {
      this._actions.onClickQuickOpenCell(id);
    }
  }

  private _openCellEvent(id: number, isMetaKey: boolean): void {
    const {
      onClickCell, onClickMarkCell, onClickQuickOpenCell,
    } = this._actions;
    const cell = this._getCell(id);
    const isOpened = cell & IS_OPENED_BIT_FLAG;
    const isFlag = cell & IS_FLAG_BIT_FLAG;
    const isUnknown = cell & IS_UNKNOWN_BIT_FLAG;

    if (isMetaKey) {
      if (isOpened) {
        onClickQuickOpenCell(id);
      } else {
        onClickMarkCell(id);
      }
    } else if (!isOpened && !isFlag && !isUnknown) {
      onClickCell(id);
    }
  }

  private _getCell(id: number): CellType {
    return this._gameState.field.field[id];
  }

  private _getPrevAvailableId(id: number): number {
    while (id >= 0) {
      if (
        !(this._getCell(id) & IS_OPENED_BIT_FLAG) ||
              (this._getCell(id) >> 8) !== 0
      ) {
        break;
      }
      id--;
    }

    return id;
  }

  private _getNextAvailableId(id: number): number {
    while (id < this._gameState.field.field.length) {
      if (
        !(this._getCell(id) & IS_OPENED_BIT_FLAG) ||
          (this._getCell(id) >> 8) !== 0
      ) {
        break;
      }
      id++;
    }

    return id;
  }

  private _lockEvents(): void {
    this._isLockedEvents = true;
  }

  private _unlockEvents(): void {
    this._isLockedEvents = false;
  }
}
