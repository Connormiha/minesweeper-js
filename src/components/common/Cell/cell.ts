import style from './cell.styl';
import bem from 'bem-css-modules';
import {
  IS_OPENED_BIT_FLAG,
  IS_BOMB_BIT_FLAG,
  IS_FLAG_BIT_FLAG,
  IS_UNKNOWN_BIT_FLAG,
} from 'helpers/utils';

import type {CellType} from 'flux/types';

const b = bem(style);

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

export default class Cell {
  public element: HTMLButtonElement;

  constructor() {
    this.element = document.createElement('button');
    this.element.type = 'button';
  }

  public render(cell: CellType, isShowBomb: boolean): void {
    const isBomb = Boolean(cell & IS_BOMB_BIT_FLAG);
    const isOpened = Boolean(cell & IS_OPENED_BIT_FLAG);
    const isDead = isBomb && isOpened;
    const isFlag = Boolean(cell & IS_FLAG_BIT_FLAG);
    const isUnknown = Boolean(cell & IS_UNKNOWN_BIT_FLAG);
    const aroundBombCount = cell >> 4;

    const cssMods: Record<string, boolean | number> = {
      open: isOpened || (isShowBomb && isBomb),
      close: !isOpened && (!isShowBomb || !isBomb),
      bomb: (isOpened || isShowBomb) && isBomb,
      dead: isDead,
      flag: isFlag && !isOpened,
      question: isUnknown && !isOpened,
    };

    if (aroundBombCount && isOpened && !isBomb) {
      cssMods.count = aroundBombCount;
    }

    this.element.className = b(cssMods);
    this.element.disabled = isOpened && aroundBombCount === 0;
    this.element.setAttribute('aria-label', getAriaLabel(cell));
    this.element.textContent = isOpened && !isBomb && aroundBombCount ? String(aroundBombCount) : '';
  }
}
