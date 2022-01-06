import { Action } from 'models/Action';

export function createAction<T>(type: string, payload?: T): Action<T | undefined> {
  return {
    type,
    payload,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function reducerFromMap<T>(
  initialState: T,
  map: { [key: string]: (state: T, action: Action<any>) => T } = {},
  middlewares?: Array<(nextState: any) => void>,
) {
  return (state: T = initialState, action: Action<any>): T => {
    const { type } = action;
    if (map[type]) {
      const actionHandler = map[type];
      const nextState = actionHandler(state, action);
      if (middlewares) {
        middlewares.forEach((fn) => fn(nextState));
      }
      return nextState;
    }
    return state;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
