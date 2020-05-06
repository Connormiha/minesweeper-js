import './Progress.styl';

import type {FieldStoreType} from 'flux/types';

export type IProgress = {
  element: HTMLDivElement;
  startUpdateProgress: () => void;
};

export const createProgress = (field: FieldStoreType): IProgress => {
  const element = document.createElement('div');
  element.className = 'progress';
  element.innerHTML = `
    <div class="progress__inner">
      <div class="progress__progress"></div>
      <div class="progress__text"></div>
    </div>
  `;
  const progressBlock = element.querySelector('.progress__progress') as HTMLDivElement;
  const textBlock = element.querySelector('.progress__text') as HTMLDivElement;

  const startUpdateProgress = (): void => {
    element.style.display = 'flex';

    const animation = (): void => {
      if (!field.isRenderInProgres) {
        element.style.display = 'none';
        return;
      }

      const percent = field.totalRendered / field.field.length * 100;
      progressBlock.style.width = `${percent}%`;
      textBlock.innerHTML = `Rendering ${percent | 0}%`;

      requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  };

  return {
    element,
    startUpdateProgress,
  };
};
