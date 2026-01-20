"use client";
import { useRef, useEffect } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "@/state";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/* REDUX PERSISTENCE */
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global"],
};
const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* REDUX STORE */
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
// Wrap useSelector to avoid hard crashes when a Provider is temporarily missing
// (e.g., during fast refresh/hydration races). This returns a sensible fallback
// result instead of throwing the react-redux context error. Components should
// still prefer checking for undefined values where appropriate.
export const useAppSelector: TypedUseSelectorHook<RootState> = (selector: any) => {
  try {
    // Attempt normal behaviour when Provider exists
    return useSelector(selector as any);
  } catch (e) {
    // If react-redux context is missing, fallback: attempt to execute selector
    // against an empty default state and return safe defaults. This prevents
    // the app from hard-failing during hydration or hot-reload races.
    try {
      const empty = {} as RootState;
      return selector(empty as any);
    } catch {
      // As a last resort, return undefined-ish values to avoid crashes.
      return undefined as any;
    }
  }
};

/* PROVIDER */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  const persistorRef = useRef<any | null>(null);

  // Create persistor only on the client after store is available
  useEffect(() => {
    if (!persistorRef.current && storeRef.current) {
      try {
        persistorRef.current = persistStore(storeRef.current);
      } catch (e) {
        // swallow — fall back to rendering children without PersistGate
        // eslint-disable-next-line no-console
        console.error('[StoreProvider] persistStore failed', e);
        persistorRef.current = null;
      }
    }
  }, []);

  return (
    <Provider store={storeRef.current}>
      {persistorRef.current ? (
        <PersistGate loading={null} persistor={persistorRef.current}>
          {children}
        </PersistGate>
      ) : (
        // If persistor isn't ready (server or failed), render children directly
        <>{children}</>
      )}
    </Provider>
  );
}
