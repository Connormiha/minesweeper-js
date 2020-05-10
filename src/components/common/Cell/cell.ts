import './cell.styl';
import {
  IS_OPENED_BIT_FLAG,
  IS_BOMB_BIT_FLAG,
  IS_FLAG_BIT_FLAG,
  IS_UNKNOWN_BIT_FLAG,
} from 'helpers/utils';

import type {CellType} from 'flux/types';

const getAriaLabel = (cell: number): string => {
  if (cell & IS_FLAG_BIT_FLAG) {
    return 'flag';
  }

  if (cell & IS_UNKNOWN_BIT_FLAG) {
    return 'unknown mark';
  }

  if (cell & IS_OPENED_BIT_FLAG) {
    if (cell >> 4 !== 0) {
      return `around bombs ${cell >> 4}`;
    }

    return 'opened empty cell';
  }

  return 'not oppened cell';
};

const defaultClassName = 'cell cell_close';

export const createCell = (i: number, state: any): HTMLButtonElement => {
  const element = document.createElement('button');

  element.type = 'button';
  element.setAttribute('aria-label', 'not oppened cell');
  element.className = defaultClassName;
  element.style.fontSize = '10px';
  element.innerHTML = `${i / state.game.width | 0}/${i % state.game.width}`;

  return element;
};

const createClassNameByCell = (cell: number, isShowBomb: boolean): string => {
  const isBomb = Boolean(cell & IS_BOMB_BIT_FLAG);
  const isOpened = Boolean(cell & IS_OPENED_BIT_FLAG);
  const isDead = isBomb && isOpened;
  const isFlag = Boolean(cell & IS_FLAG_BIT_FLAG);
  const isUnknown = Boolean(cell & IS_UNKNOWN_BIT_FLAG);
  const aroundBombCount = cell >> 4;
  const classes = ['cell'];

  if (isOpened || (isShowBomb && isBomb)) {
    if ((isOpened || isShowBomb) && isBomb) {
      classes.push('cell_bomb');
    }

    if (isDead) {
      classes.push('cell_dead');
    } else {
      classes.push('cell_open');
    }
  } else {
    classes.push('cell_close');
  }

  if (isFlag && !isOpened) {
    classes.push('cell_flag');
  }

  if (isFlag && !isBomb && isShowBomb) {
    classes.push('cell_dead');
  }

  if (isUnknown && !isOpened && !isShowBomb && !isBomb) {
    classes.push('cell_question');
  }

  if (aroundBombCount && isOpened && !isBomb) {
    classes.push(`cell_count_${aroundBombCount}`);
  }

  return classes.join(' ');
};

const CELL_CSS_CLASSES = Array.from({length: 2**8})
  .map((_, i) => createClassNameByCell(i, false));

const CELL_SHOW_BOMB_CSS_CLASSES = Array.from({length: 2**8})
  .map((_, i) => createClassNameByCell(i, true));

export const renderCell = (element: HTMLButtonElement, cell: CellType, isShowBomb: boolean): void => {
  const isBomb = Boolean(cell & IS_BOMB_BIT_FLAG);
  const isOpened = Boolean(cell & IS_OPENED_BIT_FLAG);
  const aroundBombCount = cell >> 4;

  element.className = isShowBomb ? CELL_SHOW_BOMB_CSS_CLASSES[cell] : CELL_CSS_CLASSES[cell];
  element.disabled = isOpened && aroundBombCount === 0;
  element.setAttribute('aria-label', getAriaLabel(cell));
  element.textContent = isOpened && !isBomb && aroundBombCount ? String(aroundBombCount) : '';
};
