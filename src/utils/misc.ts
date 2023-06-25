import {
  AsyncThunk,
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  createAsyncThunk as createReduxAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import { filterDeep } from 'deepdash-es/standalone';

export function omitUndefined<T>(data: T): T {
  return filterDeep(data, value => (value === undefined ? false : true), {
    leavesOnly: true,
  });
}

export function createAsyncThunk<Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg>,
  options?: AsyncThunkOptions<ThunkArg, Record<string, any>>,
): AsyncThunk<Returned, ThunkArg, Record<string, any>> {
  return createReduxAsyncThunk(typePrefix, payloadCreator, {
    serializeError: (error: unknown): SerializedError => error as SerializedError,
    ...options,
  });
}
