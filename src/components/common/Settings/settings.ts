import './settings.styl';

import type {GameType} from 'flux/types';

type ISettingsInputProps = {
  min: string;
  max: string;
  value: number;
  title: string;
}

class TextInput {
  public element: HTMLLabelElement;
  public input: HTMLInputElement;

  constructor(props: ISettingsInputProps) {
    this.element = document.createElement('label');
    this.element.className = 'settings__label';
    this.element.innerHTML = `
      <span className="settings__label-text">
        ${props.title}
      </span>
      <input
        type="number"
        min="${props.min}"
        max="${props.max}"
        value="${props.value}"
      >
    `;

    this.input = this.element.querySelector('input') as HTMLInputElement;
    this.input.addEventListener('input', () => {
      this.input.value = this.input.value.replace(/\D/g, '');
    });
  }
}

export const createSettings = (game: GameType, onStart: () => void): HTMLFormElement => {
  const element = document.createElement('form');
  element.className = 'settings';

  const inputWidth = new TextInput({
    min: '1',
    max: '10000',
    value: game.width,
    title: 'Cols',
  });

  const inputHeight = new TextInput({
    min: '1',
    max: '10000',
    value: game.height,
    title: 'Rows',
  });

  const inputMinesCount = new TextInput({
    min: '1',
    max: '10000',
    value: game.minesCount,
    title: 'Mines count',
  });

  element.appendChild(inputWidth.element);
  element.appendChild(inputHeight.element);
  element.appendChild(inputMinesCount.element);

  const submitBtn = document.createElement('input');
  submitBtn.type = 'submit';
  submitBtn.value = "Apply";

  element.appendChild(submitBtn);

  element.addEventListener('submit', (e: Event): void => {
    e.preventDefault();

    game.width = parseInt(
      inputWidth.input.value,
      10
    );

    game.height = parseInt(
      inputHeight.input.value,
      10
    );

    game.minesCount = parseInt(
      inputMinesCount.input.value,
      10
    );

    onStart();
  });

  return element;
};
