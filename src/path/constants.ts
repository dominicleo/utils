export const ESCAPE_REG = /\\(\\)?/g;
export const DEFAULT_SEPARATOR = '.';

export const ARRAY_REG = /(\[\]|\[(.*)\])$/g;
export const APPEND_ARRAY_REG = /(\[\]|\[(.*)\]\+)$/g;
export const FINISH_ARRAY_REG = /.+(\[\])/g;
export const CAN_BE_NULL_REG = /(\?)$/g;
