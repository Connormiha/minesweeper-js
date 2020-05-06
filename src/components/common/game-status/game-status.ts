import './game-status.styl';

const MINES_LEFT_TEXT = 'Mines left: ';
const WIN_STATUS_TEXT = 'You Winner!!!';

type PropsType = {
    minesLeftCount: number;
    state: 'fail' | 'win' | 'in-progress' | 'not-started';
};

export default class GameStatus {
  public element: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
  }

  public render(props: PropsType): void {
    this.element.innerHTML = this.renderInfo(props);
    this.element.className = `game-status game-status_state_${props.state}`;
  }

  public renderMinesCount(minesLeftCount: number): string {
    return `
      <span>
        ${MINES_LEFT_TEXT}
      </span>
      ${minesLeftCount}
    `;
  }

  renderWinStatus(minesLeftCount: number): string {
    return `
      <span>
        ${WIN_STATUS_TEXT}
      </span>
      ${this.renderMinesCount(minesLeftCount)}
    `;
  }

  renderInProgress(minesLeftCount: number): string {
    return this.renderMinesCount(minesLeftCount);
  }

  renderFail(minesLeftCount: number): string {
    return this.renderMinesCount(minesLeftCount);
  }

  renderNotStarted(minesLeftCount: number): string {
    return this.renderMinesCount(minesLeftCount);
  }

  private renderInfo(props: PropsType): string {
    const {state} = props;

    if (state === 'win') {
      return this.renderWinStatus(props.minesLeftCount);
    }

    if (state === 'in-progress') {
      return this.renderInProgress(props.minesLeftCount);
    }

    if (state === 'fail') {
      return this.renderFail(props.minesLeftCount);
    }

    return this.renderNotStarted(props.minesLeftCount);
  }
}
