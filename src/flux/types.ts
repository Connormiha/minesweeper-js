export type CellType = number;

export type FieldType = Uint8Array;

export type FieldStoreType = {
    field: FieldType;
    flagsCount: number;
    left: number;
    top: number;
    leftExtraCount: number;
    topExtraCount: number;
    openedCount: number;
    showAllBombs: boolean;
    isGenerated: boolean;
    isRenderInProgres: boolean;
    totalRendered: number;
};

export type GameState = 'fail' | 'win' | 'in-progress' | 'not-started';

export type GameType = {
    width: number;
    height: number;
    visibleWidth: number;
    visibleHeight: number;
    contentWidth: number;
    contentHeight: number;
    needScroll: boolean;
    minesCount: number;
    state: GameState;
};

export type FieldFillParams = {
    width: number;
    height: number;
    minesCount: number;
};
