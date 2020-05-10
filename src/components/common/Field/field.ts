import {createCell, renderCell} from 'components/common/Cell';
import { createProgress, IProgress } from 'components/common/Progress/Progress';

import {
  IS_OPENED_BIT_FLAG,
  IS_FLAG_BIT_FLAG,
  IS_UNKNOWN_BIT_FLAG,
  IS_BOMB_BIT_FLAG,
} from 'helpers/utils';

import type {CellType} from 'flux/types';
import { SchemaType } from 'reducers/schema';

import './field.styl';

const KEY_ENTER = 13;
const KEY_SPACE = 32;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const allowedKeys = [KEY_ENTER, KEY_SPACE, KEY_DOWN, KEY_UP, KEY_LEFT, KEY_RIGHT];
const EXTRA_VISIBLE_CELLS_COUNT = 2;

type PropsType = {
    onClickCell: (id: number) => void;
    onClickMarkCell: (id: number) => void;
    onClickQuickOpenCell: (id: number) => void;
};

export default class Field {
  public element: HTMLDivElement;
  private _content: HTMLDivElement;
  private _contentWrapper: HTMLDivElement;
  private _isLockedEvents: boolean;
  private _actions: PropsType;
  private _gameState: SchemaType;
  private _timer!: number;
  private _progress: IProgress;
  public progressElement: HTMLDivElement;

  constructor(actions: PropsType, gameState: SchemaType) {
    this._actions = actions;
    this._isLockedEvents = false;
    this._gameState = gameState;
    this._progress = createProgress(gameState.field);
    this.progressElement = this._progress.element;

    this.element = document.createElement('div');
    this.element.className = 'field';

    this._contentWrapper = document.createElement('div');
    this._contentWrapper.className = 'field__wrapper';

    this._content = document.createElement('div');
    this._content.className = 'field__content';

    this._contentWrapper.appendChild(this._content);

    this.element.appendChild(this._contentWrapper);

    this.element.addEventListener('click', this);
    this.element.addEventListener('contextmenu', this);
    this.element.addEventListener('dblclick', this);
    this.element.addEventListener('mouseup', this);
    this.element.addEventListener('keydown', this);
    this.element.addEventListener('scroll', this);
  }

  public renderAll(): void {
    this._content.innerHTML = '';
    const {width, height, contentHeight, contentWidth, visibleHeight, visibleWidth} = this._gameState.game;
    this._contentWrapper.style.width = `${width * 34}px`;
    this._contentWrapper.style.height = `${height * 34}px`;
    this._content.style.width = `${contentWidth * 34}px`;
    this.element.className = `field ${this._gameState.game.needScroll ? 'field_scroll' : ''}`;
    this.element.style.width = `${visibleWidth * 34}px`;
    this.element.style.height = `${visibleHeight * 34}px`;

    const fragment = document.createDocumentFragment();

    const stepColumn = width - contentWidth;
    let index = (
      width * this._gameState.field.top + this._gameState.field.left
    );
    for (let j = 0; j < contentHeight; j++) {
      for (let i = 0; i < contentWidth; i++) {
        fragment.appendChild(createCell(index, this._gameState));
        index++;
      }
      index += stepColumn;
    }

    this._updatePosition();

    this.element.scrollLeft = (this._gameState.field.left + this._gameState.field.leftExtraCount) * 34;
    this.element.scrollTop = (this._gameState.field.top + this._gameState.field.topExtraCount) * 34;

    this._content.appendChild(fragment);
  }

  private _updatePosition(): void {
    const leftPosition = Math.min(
      this._gameState.field.left, this._gameState.game.width - this._gameState.game.contentWidth
    ) * 34;
    const topPosition = Math.min(
      this._gameState.field.top,
      this._gameState.field.top, this._gameState.game.height - this._gameState.game.contentHeight
    ) * 34;

    this._content.style.left = `${leftPosition}px`;
    this._content.style.top = `${topPosition}px`;
  }

  public renderCell(id: number): void {
    const locked = this._gameState.field.showAllBombs || this._gameState.game.state === 'win'

    if (locked) {
      this.element.classList.add('field_locked');
    }

    const row = id / this._gameState.game.width | 0
    const column = id % this._gameState.game.width;
    console.log(this._gameState);
    console.log({row, column, id});
    if (
      row >= this._gameState.field.top
      && row <= this._gameState.field.top + this._gameState.game.contentHeight
      && column >= this._gameState.field.left
      && column <= this._gameState.field.left + this._gameState.game.contentWidth
    ) {
      const index = (
        ((row - this._gameState.field.top) * this._gameState.game.contentWidth)
        + (column - this._gameState.field.left)
      );
      console.log({row, column, index, id});
      renderCell(
        this._content.children[index] as HTMLButtonElement,
        this._gameState.field.field[id],
        this._gameState.field.showAllBombs
      );
    }
  }

  public reRenderAll(): void {
    const locked = this._gameState.field.showAllBombs || this._gameState.game.state === 'win'
    this.element.className = `field ${locked ? 'field_locked' : ''}`

    for (let i = 0; i < this._gameState.field.field.length; i++) {
      const cell = this._gameState.field.field[i];

      if (cell & IS_BOMB_BIT_FLAG) {
        renderCell(this._content.children[i] as HTMLButtonElement, cell, this._gameState.field.showAllBombs);
      }
    }
  }

  public handleEvent(e: MouseEvent | KeyboardEvent): void {
    e.preventDefault();

    if (e.type === 'scroll') {
      this._gameState.field.left = Math.round(this.element.scrollLeft / 34);
      this._gameState.field.top = Math.round(this.element.scrollTop / 34);
      this._updatePosition();
      return;
    }

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

    const id = this._getRealID(Array.prototype.indexOf.call(parent.children, current));

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
        this._handleContextMenu(this._getRealID(id));
        break;

      case KEY_ENTER:
        this._openCellEvent(this._getRealID(id), false);
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

    this._timer = setTimeout(() => this._unlockEvents(), 100) as unknown as number;
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

  private _getRealID(id: number): number {
    const row = (id / this._gameState.game.contentWidth | 0) + this._gameState.field.top
    const column = (id % this._gameState.game.contentWidth) + this._gameState.field.left;
    return (
      row  * this._gameState.game.width + column
    );
  }

  private _getCell(id: number): CellType {
    return this._gameState.field.field[id];
  }

  private _getPrevAvailableId(id: number): number {
    while (id >= 0) {
      const cell = this._getCell(id);
      if (
        !(cell & IS_OPENED_BIT_FLAG) ||
              (cell >> 8) !== 0
      ) {
        break;
      }
      id--;
    }

    return id;
  }

  private _getNextAvailableId(id: number): number {
    while (id < this._gameState.field.field.length) {
      const cell = this._getCell(id);
      if (
        !(cell & IS_OPENED_BIT_FLAG) ||
          (cell >> 8) !== 0
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
