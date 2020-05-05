import style from './cell.styl';
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

const defaultClassName = `${style.cell} ${style.cell_close}`;

export const createCell = (): HTMLButtonElement => {
  const element = document.createElement('button');

  element.type = 'button';
  element.setAttribute('aria-label', 'not oppened cell');
  element.className = defaultClassName;

  return element;
}

export const renderCell = (element: HTMLButtonElement, cell: CellType, isShowBomb: boolean): void => {
  const isBomb = Boolean(cell & IS_BOMB_BIT_FLAG);
  const isOpened = Boolean(cell & IS_OPENED_BIT_FLAG);
  const isDead = isBomb && isOpened;
  const isFlag = Boolean(cell & IS_FLAG_BIT_FLAG);
  const isUnknown = Boolean(cell & IS_UNKNOWN_BIT_FLAG);
  const aroundBombCount = cell >> 4;
  const classes = [style.cell];

  if (isOpened || (isShowBomb && isBomb)) {
    classes.push(style.cell_open);

    if ((isOpened || isShowBomb) && isBomb) {
      classes.push(style.cell_bomb);
    }

    if (isDead) {
      classes.push(style.cell_dead);
    }
  } else {
    classes.push(style.cell_close);
  }

  if (isFlag && !isOpened && !isShowBomb && !isBomb) {
    classes.push(style.cell_flag);
  }

  if (isUnknown && !isOpened && !isShowBomb && !isBomb) {
    classes.push(style.cell_question);
  }

  if (aroundBombCount && isOpened && !isBomb) {
    classes.push(style[`cell_count_${aroundBombCount}`]);
  }

  element.className = classes.join(' ');
  element.disabled = isOpened && aroundBombCount === 0;
  element.setAttribute('aria-label', getAriaLabel(cell));
  element.textContent = isOpened && !isBomb && aroundBombCount ? String(aroundBombCount) : '';
};
