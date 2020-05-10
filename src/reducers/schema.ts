import type {FieldStoreType, GameType} from 'flux/types';

export type SchemaType = {
    game: GameType;
    field: FieldStoreType;
};

const schema: SchemaType = {
  game: {
    width: 16,
    height: 10,
    visibleWidth: 16,
    visibleHeight: 10,
    contentWidth: 16,
    contentHeight: 10,
    minesCount: 30,
    needScroll: false,
    state: 'not-started',
  },
  field: {
    field: new Uint8Array(),
    flagsCount: 0,
    openedCount: 0,
    left: 0,
    top: 0,
    showAllBombs: false,
    isGenerated: false,
    isRenderInProgres: false,
    totalRendered: 0,
  },
};

export default schema;
