import bem from 'bem-css-modules';
import style from './settings.styl';

import type {GameType} from 'flux/types';

const b = bem(style);
const label = b('label');
const labelText = b('label-text');

type ISettingsInputProps = {
  min: string;
  max: string;
  value: number;
  title: string;
  onChange: (e: InputEvent) => void;
}

class TextInput {
  public element: HTMLLabelElement;
  public input: HTMLInputElement;

  constructor(props: ISettingsInputProps) {
    this.element = document.createElement('label');
    this.element.className = label;
    this.element.innerHTML = `
      <span className="${labelText}">
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
    this.input.addEventListener('input', props.onChange);
  }
}

type ISetingsActions = {
  onStart: () => void;
}

export default class Settings {
  public element: HTMLFormElement;
  private _inputWidth: TextInput;
  private _inputHeight: TextInput;
  private _inputMinesCount: TextInput;
  private _actions: ISetingsActions;

  constructor(game: GameType, actions: ISetingsActions) {
    this._actions = actions;

    this.element = document.createElement('form');
    this.element.className = b();
    this.element.addEventListener('submit', this);

    this._inputWidth = new TextInput({
      min: '1',
      max: '10000',
      value: game.width,
      title: 'Cols',
      onChange: (e: InputEvent): void => {
        game.width = parseInt((e.target as HTMLInputElement).value, 10)
      },
    });

    this._inputHeight = new TextInput({
      min: '1',
      max: '10000',
      value: game.height,
      title: 'Rows',
      onChange: (e: InputEvent): void => {
        game.height = parseInt((e.target as HTMLInputElement).value, 10)
      },
    });

    this._inputMinesCount = new TextInput({
      min: '1',
      max: '10000',
      value: game.minesCount,
      title: 'Mines count',
      onChange: (e: InputEvent): void => {
        game.minesCount = parseInt((e.target as HTMLInputElement).value, 10)
      },
    });

    this.element.appendChild(this._inputWidth.element);
    this.element.appendChild(this._inputHeight.element);
    this.element.appendChild(this._inputMinesCount.element);

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = "Apply";

    this.element.appendChild(submitBtn);
  }

  public handleEvent(e: Event): void {
    e.preventDefault();

    this._actions.onStart();
  }
}
