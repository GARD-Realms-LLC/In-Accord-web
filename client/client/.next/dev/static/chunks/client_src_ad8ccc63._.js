(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/client/src/state/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "globalSlice",
    ()=>globalSlice,
    "setIsDarkMode",
    ()=>setIsDarkMode,
    "setIsSidebarCollapsed",
    ()=>setIsSidebarCollapsed,
    "setSidebarWidth",
    ()=>setSidebarWidth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    isSidebarCollapsed: false,
    isDarkMode: false,
    sidebarWidth: 80
};
const globalSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "global",
    initialState,
    reducers: {
        setIsSidebarCollapsed: (state, action)=>{
            state.isSidebarCollapsed = action.payload;
        },
        setIsDarkMode: (state, action)=>{
            state.isDarkMode = action.payload;
        },
        setSidebarWidth: (state, action)=>{
            state.sidebarWidth = action.payload;
        }
    }
});
const { setIsSidebarCollapsed, setIsDarkMode, setSidebarWidth } = globalSlice.actions;
const __TURBOPACK__default__export__ = globalSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/state/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "useGetDashboardMetricsQuery",
    ()=>useGetDashboardMetricsQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
;
const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: ("TURBOPACK compile-time value", "http://localhost:8000")
    }),
    reducerPath: "api",
    tagTypes: [
        "DashboardMetrics",
        "Products",
        "Users",
        "Expenses"
    ],
    endpoints: (build)=>({
            getDashboardMetrics: build.query({
                query: ()=>"/dashboard",
                providesTags: [
                    "DashboardMetrics"
                ]
            })
        })
});
const { useGetDashboardMetricsQuery } = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/app/redux.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreProvider,
    "makeStore",
    ()=>makeStore,
    "useAppDispatch",
    ()=>useAppDispatch,
    "useAppSelector",
    ()=>useAppSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/redux/dist/redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/state/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/state/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/redux-persist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__ = __turbopack_context__.i("[project]/client/node_modules/redux-persist/es/persistStore.js [app-client] (ecmascript) <export default as persistStore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__ = __turbopack_context__.i("[project]/client/node_modules/redux-persist/es/persistReducer.js [app-client] (ecmascript) <export default as persistReducer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/redux-persist/es/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/redux-persist/es/integration/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$lib$2f$storage$2f$createWebStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/redux-persist/lib/storage/createWebStorage.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
/* REDUX PERSISTENCE */ const createNoopStorage = ()=>{
    return {
        getItem (_key) {
            return Promise.resolve(null);
        },
        setItem (_key, value) {
            return Promise.resolve(value);
        },
        removeItem (_key) {
            return Promise.resolve();
        }
    };
};
const storage = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$lib$2f$storage$2f$createWebStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("local");
const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "global"
    ]
};
const rootReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["combineReducers"])({
    global: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    [__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].reducer
});
const persistedReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistReducer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistReducer$3e$__["persistReducer"])(persistConfig, rootReducer);
const makeStore = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLUSH"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REHYDRATE"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAUSE"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PERSIST"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PURGE"],
                        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGISTER"]
                    ]
                }
            }).concat(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].middleware)
    });
};
const useAppDispatch = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "6a914c376e896391bb22e951601b21e0059713dffad2fe3ad22a37930f20c595") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6a914c376e896391bb22e951601b21e0059713dffad2fe3ad22a37930f20c595";
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
};
_s(useAppDispatch, "jI3HA1r1Cumjdbu14H7G+TUj798=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"]
    ];
});
const useAppSelector = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"];
function StoreProvider({ children }) {
    _s1();
    const storeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    if (!storeRef.current) {
        storeRef.current = makeStore();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setupListeners"])(storeRef.current.dispatch);
    }
    const persistor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$persistStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__persistStore$3e$__["persistStore"])(storeRef.current);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: storeRef.current,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$redux$2d$persist$2f$es$2f$integration$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PersistGate"], {
            loading: null,
            persistor: persistor,
            children: children
        }, void 0, false, {
            fileName: "[project]/client/src/app/redux.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/app/redux.tsx",
        lineNumber: 78,
        columnNumber: 10
    }, this);
}
_s1(StoreProvider, "EtiU7pDwGhTDZwMnrKEqZbxjqXE=");
_c = StoreProvider;
var _c;
__turbopack_context__.k.register(_c, "StoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/app/(components)/Navbar/LoginModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function LoginModal({ show, onClose, onSubmit, initialUsername }) {
    _s();
    if (!show) return null;
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialUsername || '');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function submit() {
        setError(null);
        if (!username.trim()) {
            setError('Username is required');
            return;
        }
        setLoading(true);
        try {
            const r = await onSubmit(username.trim(), password);
            if (r && r.ok) {
                setPassword('');
                onClose();
            } else {
                setError(r?.error || 'Login failed');
            }
        } catch (e) {
            setError('Network error');
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black opacity-40",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-3",
                        children: "Login"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-sm block mb-1",
                        children: "Username"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        autoFocus: true,
                        value: username,
                        onChange: (e_0)=>setUsername(e_0.target.value),
                        onKeyDown: (e_1)=>{
                            if (e_1.key === 'Enter') void submit();
                        },
                        className: "w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-sm mb-2"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-sm block mb-1",
                        children: "Password"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: password,
                        onChange: (e_2)=>setPassword(e_2.target.value),
                        onKeyDown: (e_3)=>{
                            if (e_3.key === 'Enter') void submit();
                        },
                        type: "password",
                        className: "w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-sm mb-2"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-red-600 dark:text-red-400 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 58,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void submit(),
                                disabled: loading,
                                className: "px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded",
                                children: loading ? 'Signing in...' : 'Sign in'
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-center text-sm text-gray-600 dark:text-gray-400",
                        children: [
                            "Don't have an account?",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/signup",
                                className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium",
                                children: "Create one"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/(components)/Navbar/LoginModal.tsx",
        lineNumber: 46,
        columnNumber: 10
    }, this);
}
_s(LoginModal, "XHtcEbT8xfDZG3GNpCI4bJ+SkbU=");
_c = LoginModal;
var _c;
__turbopack_context__.k.register(_c, "LoginModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/app/(components)/Navbar/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/app/redux.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/state/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f28$components$292f$Navbar$2f$LoginModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/app/(components)/Navbar/LoginModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
const Navbar = ()=>{
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "Navbar.useAppSelector[isSidebarCollapsed]": (state)=>state.global.isSidebarCollapsed
    }["Navbar.useAppSelector[isSidebarCollapsed]"]);
    // Simple local auth state for UI (persisted to localStorage)
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Navbar.useState": ()=>{
            try {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                const raw = localStorage.getItem('currentUser');
                return raw ? JSON.parse(raw) : null;
            } catch  {
                return null;
            }
        }
    }["Navbar.useState"]);
    // Listen for localStorage changes (e.g., when profile is updated)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const handleStorageChange = {
                "Navbar.useEffect.handleStorageChange": ()=>{
                    try {
                        const raw_0 = localStorage.getItem('currentUser');
                        const updated = raw_0 ? JSON.parse(raw_0) : null;
                        setCurrentUser(updated);
                    } catch  {}
                }
            }["Navbar.useEffect.handleStorageChange"];
            // Listen for storage events (from other tabs) and custom events (from same tab)
            window.addEventListener('storage', handleStorageChange);
            window.addEventListener('userUpdated', handleStorageChange);
            return ({
                "Navbar.useEffect": ()=>{
                    window.removeEventListener('storage', handleStorageChange);
                    window.removeEventListener('userUpdated', handleStorageChange);
                }
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            try {
                if ("TURBOPACK compile-time truthy", 1) {
                    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    else localStorage.removeItem('currentUser');
                }
            } catch  {}
        }
    }["Navbar.useEffect"], [
        currentUser
    ]);
    const [showLoginModal, setShowLoginModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [avatarError, setAvatarError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const avatarUrl = currentUser?.avatar || currentUser?.avatarUrl || 'https://ui-avatars.com/api/?name=Not+Logged+In';
    const isGeneratedAvatar = typeof avatarUrl === 'string' && avatarUrl.includes('ui-avatars.com');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            setAvatarError(false);
        }
    }["Navbar.useEffect"], [
        avatarUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            try {
                // Debugging: log current avatar state to help diagnose why navbar shows fallback
                // Remove these logs once the issue is resolved.
                // eslint-disable-next-line no-console
                console.log('Navbar avatar debug:', {
                    avatarUrl,
                    isGeneratedAvatar,
                    avatarError,
                    currentUser
                });
            } catch (e) {}
        }
    }["Navbar.useEffect"], [
        avatarUrl,
        isGeneratedAvatar,
        avatarError,
        currentUser
    ]);
    async function handleLogin(username, password) {
        const name = (username || '').trim();
        if (!name) return {
            ok: false,
            error: 'Username required'
        };
        try {
            const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: name,
                    password
                })
            });
            if (!res.ok) {
                const j = await res.json().catch(()=>({}));
                return {
                    ok: false,
                    error: j.error || 'Login failed'
                };
            }
            const j_0 = await res.json();
            const user = j_0.user || {
                name: name,
                username: name
            };
            console.log('Login response user:', user);
            console.log('User role from backend:', user.role);
            try {
                const sres = await fetch(`${API_BASE}/api/admin/sessions/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user
                    })
                });
                const sjson = await sres.json().catch(()=>({}));
                if (sjson?.ok && sjson.session) {
                    try {
                        localStorage.setItem('sessionId', sjson.session.id);
                    } catch  {}
                }
            } catch (e_1) {
                console.warn('Failed to create session', e_1);
            }
            const fullUser = {
                id: user.id || user.userId,
                userId: user.id || user.userId,
                name: user.name || name,
                username: user.username || name,
                email: user.email,
                role: user.role || 'User',
                avatar: user.avatar || user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || name)}`
            };
            console.log('Setting currentUser:', fullUser);
            setCurrentUser(fullUser);
            // Save to localStorage immediately and notify
            try {
                localStorage.setItem('currentUser', JSON.stringify(fullUser));
                console.log('Saved to localStorage:', fullUser);
            } catch (e_2) {
                console.error('Failed to save to localStorage', e_2);
            }
            // notify other parts of the app that a session was created
            try {
                window.dispatchEvent(new CustomEvent('sessionCreated', {
                    detail: {
                        user: fullUser,
                        sessionId: ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('sessionId') : "TURBOPACK unreachable"
                    }
                }));
                window.dispatchEvent(new Event('userUpdated'));
            } catch  {}
            return {
                ok: true,
                user: fullUser
            };
        } catch (e_0) {
            console.error('Login error', e_0);
            // If backend is not reachable, provide a helpful error message
            const errorMsg = e_0 instanceof TypeError && e_0.message.includes('fetch') ? 'Backend server not reachable. Please make sure the server is running on ' + API_BASE : 'Network error';
            return {
                ok: false,
                error: errorMsg
            };
        }
    }
    const isDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "Navbar.useAppSelector[isDarkMode]": (state_0)=>state_0.global.isDarkMode
    }["Navbar.useAppSelector[isDarkMode]"]);
    const toggleSidebar = ()=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setIsSidebarCollapsed"])(!isSidebarCollapsed));
    };
    const toggleDarkMode = ()=>{
        console.log('Dark mode toggle clicked. Current isDarkMode state:', isDarkMode);
        const newState = !isDarkMode;
        console.log('Dispatching new state:', newState);
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setIsDarkMode"])(newState));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-between items-center w-full mb-7 px-4 py-3 rounded-lg",
        style: {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f3f4f6' : '#111827'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center gap-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex justify-between items-center gap-5"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 191,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600",
                        onClick: toggleSidebar,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            className: "w-4 h-4 dark:text-gray-300"
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                            lineNumber: 194,
                            columnNumber: 10
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 193,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "search",
                        placeholder: "Start typing  to search",
                        className: "pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-blue-500"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-y-0 left-0 pl- flex items-center pointer-events-none",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                            className: "text-gray-500 dark:text-gray-400",
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center gap-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex justify-between items-center gap-5"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleDarkMode,
                        className: "px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 z-50",
                        type: "button",
                        children: isDarkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                            className: "cursor-pointer text-gray-500 dark:text-yellow-400",
                            size: 24
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                            lineNumber: 209,
                            columnNumber: 27
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                            className: "cursor-pointer text-gray-500 dark:text-gray-300",
                            size: 24
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                            lineNumber: 209,
                            columnNumber: 109
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 208,
                        columnNumber: 12
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                className: "cursor-pointer text-gray-500",
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute -top-2 -right-2 inline-flex items-center justify-center  px-[0.4rem] py-1 text-xs leading-none text-red-100 bg-red-600 rounded-full",
                                children: "3"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 211,
                        columnNumber: 12
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                        className: "w-0 h-7 border border-solid border-l border-gray-300 mx-3"
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 218,
                        columnNumber: 12
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            !avatarError && !isGeneratedAvatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: avatarUrl,
                                alt: currentUser?.name ?? 'user',
                                className: "w-9 h-9 rounded-full object-cover bg-gray-200",
                                onError: ()=>setAvatarError(true)
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                lineNumber: 220,
                                columnNumber: 51
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    className: "text-gray-600",
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                    lineNumber: 221,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                lineNumber: 220,
                                columnNumber: 206
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: currentUser?.name ?? 'Not Logged In'
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 219,
                        columnNumber: 12
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            !currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowLoginModal(true),
                                        className: "px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded",
                                        children: "Login"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                        lineNumber: 227,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f28$components$292f$Navbar$2f$LoginModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        show: showLoginModal,
                                        onClose: ()=>setShowLoginModal(false),
                                        onSubmit: handleLogin
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                        lineNumber: 228,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true),
                            currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    try {
                                        const sessionId = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('sessionId') : "TURBOPACK unreachable";
                                        if (sessionId) {
                                            await fetch(`${API_BASE}/api/admin/sessions/terminate`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    sessionId
                                                })
                                            }).catch(()=>null);
                                            try {
                                                localStorage.removeItem('sessionId');
                                            } catch  {}
                                        }
                                        await fetch(`${API_BASE}/api/admin/auth/logout`, {
                                            method: 'POST'
                                        }).catch(()=>null);
                                    } catch (e_3) {
                                        console.warn('Logout error', e_3);
                                    }
                                    // Clear user immediately and notify listeners
                                    try {
                                        localStorage.removeItem('currentUser');
                                    } catch  {}
                                    setCurrentUser(null);
                                    try {
                                        window.dispatchEvent(new Event('userUpdated'));
                                    } catch  {}
                                    // Prefer a hard navigation to ensure protected pages unload
                                    try {
                                        router.replace('/home');
                                    } catch  {}
                                    // Fallback in case router navigation is blocked
                                    try {
                                        setTimeout(()=>{
                                            window.location.assign('/home');
                                        }, 50);
                                    } catch  {}
                                },
                                className: "px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded",
                                children: "Logoff"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                                lineNumber: 230,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/(components)/Navbar/index.tsx",
        lineNumber: 184,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Navbar, "tIZsOgP0C5X9O02OnRb34WT6Tjg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c = Navbar;
const __TURBOPACK__default__export__ = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/app/(components)/Sidebar/index.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/app/redux.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/state/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/archive.js [app-client] (ecmascript) <export default as Archive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BotIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as BotIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDollarSignIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/circle-dollar-sign.js [app-client] (ecmascript) <export default as CircleDollarSignIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/clipboard.js [app-client] (ecmascript) <export default as Clipboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$drumstick$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DrumstickIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/drumstick.js [app-client] (ecmascript) <export default as DrumstickIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileQuestionIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/file-question-mark.js [app-client] (ecmascript) <export default as FileQuestionIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/panels-top-left.js [app-client] (ecmascript) <export default as Layout>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pc$2d$case$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PcCaseIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/pc-case.js [app-client] (ecmascript) <export default as PcCaseIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlugIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/plug.js [app-client] (ecmascript) <export default as PlugIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ServerCogIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/server-cog.js [app-client] (ecmascript) <export default as ServerCogIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StarsIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as StarsIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2Icon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/users-round.js [app-client] (ecmascript) <export default as Users2Icon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$webhook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WebhookIcon$3e$__ = __turbopack_context__.i("[project]/client/node_modules/lucide-react/dist/esm/icons/webhook.js [app-client] (ecmascript) <export default as WebhookIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/@radix-ui/react-tooltip/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const SidebarLink = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "4ad0866ba301ddcd6da0af4bbc7cbf510d6dff7d68ba6a16a3dcdafff3c81f4a") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4ad0866ba301ddcd6da0af4bbc7cbf510d6dff7d68ba6a16a3dcdafff3c81f4a";
    }
    const { href, icon: Icon, label, isCollapsed } = t0;
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const rootActivePaths = [
        "/home",
        "/plugins",
        "/themes",
        "/uploads",
        "/dashboard",
        "/inventory",
        "/products",
        "/profile",
        "/expenses",
        "/bots",
        "/servers",
        "/hosting",
        "/users",
        "/support",
        "/team",
        "/administrator"
    ];
    const isActive = pathname === href || pathname === "/" && rootActivePaths.includes(href);
    const t1 = `cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md ${isCollapsed ? "justify-center py-3" : "justify-start px-4 py-3"}
        hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 gap-3 transition-colors ${isActive ? "bg-blue-200 text-white dark:bg-blue-600" : ""}
      }`;
    let t2;
    if ($[1] !== Icon) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            className: "w-6 h-6 text-black dark:text-gray-300"
        }, void 0, false, {
            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
            lineNumber: 39,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = Icon;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const t3 = `${isCollapsed ? "hidden" : "block"} font-medium text-base text-black dark:text-gray-300`;
    let t4;
    if ($[3] !== label || $[4] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t3,
            children: label
        }, void 0, false, {
            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
            lineNumber: 48,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[3] = label;
        $[4] = t3;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== t1 || $[7] !== t2 || $[8] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: [
                t2,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = t1;
        $[7] = t2;
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== href || $[11] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            children: t5
        }, void 0, false, {
            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
            lineNumber: 67,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[10] = href;
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    return t6;
};
_s(SidebarLink, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SidebarLink;
const SectionLabel = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "4ad0866ba301ddcd6da0af4bbc7cbf510d6dff7d68ba6a16a3dcdafff3c81f4a") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4ad0866ba301ddcd6da0af4bbc7cbf510d6dff7d68ba6a16a3dcdafff3c81f4a";
    }
    const { text, isCollapsed } = t0;
    const t1 = `${isCollapsed ? "hidden" : "block"} px-4 mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase`;
    let t2;
    if ($[1] !== t1 || $[2] !== text) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t1,
            children: text
        }, void 0, false, {
            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
            lineNumber: 91,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t1;
        $[2] = text;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
};
_c1 = SectionLabel;
const Sidebar = ()=>{
    _s1();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    const isSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "Sidebar.useAppSelector[isSidebarCollapsed]": (state)=>state.global.isSidebarCollapsed
    }["Sidebar.useAppSelector[isSidebarCollapsed]"]);
    const isDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "Sidebar.useAppSelector[isDarkMode]": (state_0)=>state_0.global.isDarkMode
    }["Sidebar.useAppSelector[isDarkMode]"]);
    const sidebarWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "Sidebar.useAppSelector[sidebarWidth]": (state_1)=>state_1.global.sidebarWidth
    }["Sidebar.useAppSelector[sidebarWidth]"]);
    const [currentUserRole, setCurrentUserRole] = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [isLoggedIn, setIsLoggedIn] = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "Sidebar.useEffect": ()=>{
            try {
                const raw = localStorage.getItem('currentUser');
                if (raw) {
                    const user = JSON.parse(raw);
                    console.log('Sidebar: User loaded from localStorage:', user);
                    console.log('Sidebar: User role:', user.role);
                    setCurrentUserRole(user.role || null);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch  {
                setIsLoggedIn(false);
            }
            const handleUserUpdate = {
                "Sidebar.useEffect.handleUserUpdate": ()=>{
                    try {
                        const raw_0 = localStorage.getItem('currentUser');
                        if (raw_0) {
                            const user_0 = JSON.parse(raw_0);
                            console.log('Sidebar: User updated:', user_0);
                            console.log('Sidebar: Updated role:', user_0.role);
                            setCurrentUserRole(user_0.role || null);
                            setIsLoggedIn(true);
                        } else {
                            setCurrentUserRole(null);
                            setIsLoggedIn(false);
                        }
                    } catch  {
                        setIsLoggedIn(false);
                    }
                }
            }["Sidebar.useEffect.handleUserUpdate"];
            window.addEventListener('userUpdated', handleUserUpdate);
            window.addEventListener('storage', handleUserUpdate);
            window.addEventListener('sessionCreated', handleUserUpdate);
            return ({
                "Sidebar.useEffect": ()=>{
                    window.removeEventListener('userUpdated', handleUserUpdate);
                    window.removeEventListener('storage', handleUserUpdate);
                    window.removeEventListener('sessionCreated', handleUserUpdate);
                }
            })["Sidebar.useEffect"];
        }
    }["Sidebar.useEffect"], []);
    const discordUrl = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/your-server';
    const facebookUrl = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/your-page';
    const linkedinUrl = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/your-company';
    const githubUrl = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/your-repo';
    const startXRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const startWidthRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isResizingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const collapsedWidth = 68;
    // Allow an even thinner minimum while keeping icons usable
    const minWidth = 70;
    const maxWidth = 320;
    // Default open width trimmed further for a slimmer sidebar
    const defaultOpenWidth = 80;
    const toggleSidebar = ()=>{
        if (isSidebarCollapsed) {
            // Reopen to a sensible default, ignoring the previous shrunken width
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSidebarWidth"])(Math.min(Math.max(defaultOpenWidth, minWidth), maxWidth)));
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setIsSidebarCollapsed"])(false));
        } else {
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setIsSidebarCollapsed"])(true));
        }
    };
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Sidebar.useCallback[handleMouseMove]": (event)=>{
            if (!isResizingRef.current) return;
            const delta = event.clientX - startXRef.current;
            const nextWidth = Math.min(Math.max(startWidthRef.current + delta, minWidth), maxWidth);
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSidebarWidth"])(nextWidth));
        }
    }["Sidebar.useCallback[handleMouseMove]"], [
        dispatch
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Sidebar.useCallback[handleMouseUp]": ()=>{
            if (!isResizingRef.current) return;
            isResizingRef.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }["Sidebar.useCallback[handleMouseUp]"], [
        handleMouseMove
    ]);
    const handleMouseDown = (event_0)=>{
        if (isSidebarCollapsed) return;
        isResizingRef.current = true;
        startXRef.current = event_0.clientX;
        startWidthRef.current = sidebarWidth;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            return ({
                "Sidebar.useEffect": ()=>{
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
            })["Sidebar.useEffect"];
        }
    }["Sidebar.useEffect"], [
        handleMouseMove,
        handleMouseUp
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Sidebar.useEffect": ()=>{
            const normalized = Math.min(Math.max(sidebarWidth, minWidth), maxWidth);
            if (normalized !== sidebarWidth) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$state$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSidebarWidth"])(normalized));
            }
        }
    }["Sidebar.useEffect"], [
        sidebarWidth,
        dispatch
    ]);
    const clampedWidth = Math.min(Math.max(sidebarWidth, minWidth), maxWidth);
    const appliedWidth = isSidebarCollapsed ? collapsedWidth : clampedWidth;
    // Hide sidebar if not logged in
    if (!isLoggedIn) {
        return null;
    }
    // Keep the sidebar as a full-height column so the footer can sit at the bottom on tall viewports
    // Make sidebar relative so the resize handle is positioned correctly
    const sidebarClassNames = `relative flex flex-col h-screen bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden shadow-md z-40`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: sidebarClassNames,
            style: {
                width: `${appliedWidth}px`,
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                color: isDarkMode ? '#f3f4f6' : '#111827'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex justify-center items-center pt-4 pb-4 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/home",
                        "aria-label": "Go to home",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/splash.jpg",
                            alt: "In-Accord",
                            className: `${isSidebarCollapsed ? 'w-10 h-10' : 'w-full'} object-contain`
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 223,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                        lineNumber: 222,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                    lineNumber: 221,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                    lineNumber: 228,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 mt-6 flex flex-col gap-1 overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/home",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"],
                            label: "Home",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 230,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionLabel, {
                            text: "Download",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 231,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/plugins",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlugIcon$3e$__["PlugIcon"],
                            label: "Plugins",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 232,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/themes",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileQuestionIcon$3e$__["FileQuestionIcon"],
                            label: "Themes",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 233,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/uploads",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$drumstick$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DrumstickIcon$3e$__["DrumstickIcon"],
                            label: "Uploads",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 234,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionLabel, {
                            text: "My Stuff",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 235,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/dashboard",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__["Layout"],
                            label: "My Dashboard",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 236,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/inventory",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__["Archive"],
                            label: "My Downloads",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 237,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/products",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__["Clipboard"],
                            label: "My Products",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 238,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/profile",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
                            label: "My Profile",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 239,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/expenses",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDollarSignIcon$3e$__["CircleDollarSignIcon"],
                            label: "My Contracts",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 240,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionLabel, {
                            text: "Adverts",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 241,
                            columnNumber: 5
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/bots",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BotIcon$3e$__["BotIcon"],
                            label: "Bots/Apps",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 242,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/servers",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2d$cog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ServerCogIcon$3e$__["ServerCogIcon"],
                            label: "Servers",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 243,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/hosting",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pc$2d$case$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PcCaseIcon$3e$__["PcCaseIcon"],
                            label: "Hosting",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 244,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/users",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"],
                            label: "Ask a Dev",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 245,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionLabel, {
                            text: "Contacts",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 246,
                            columnNumber: 7
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/support",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$webhook$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WebhookIcon$3e$__["WebhookIcon"],
                            label: "Support",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 247,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/team",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users2Icon$3e$__["Users2Icon"],
                            label: "Our Team",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 248,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                    lineNumber: 229,
                    columnNumber: 5
                }, ("TURBOPACK compile-time value", void 0)),
                console.log('Sidebar: currentUserRole =', currentUserRole, 'Should show admin?', currentUserRole === 'Admin'),
                currentUserRole === 'Admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarLink, {
                            href: "/administrator",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__StarsIcon$3e$__["StarsIcon"],
                            label: "Admin",
                            isCollapsed: isSidebarCollapsed
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                            className: "mt-2 border-gray-300 dark:border-gray-600"
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 255,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                    lineNumber: 253,
                    columnNumber: 39
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-auto mb-4 px-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center gap-2`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: discordUrl,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                "aria-label": "Discord",
                                                className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    viewBox: "0 0 24 24",
                                                    fill: "currentColor",
                                                    className: "w-[18px] h-[18px] text-[#5865F2]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M20.317 4.369A19.791 19.791 0 0 0 16.558 3c-.19.335-.41.78-.563 1.137a18.27 18.27 0 0 0-4.01 0A8.84 8.84 0 0 0 11.422 3c-1.33.242-2.63.62-3.86 1.137C4.913 6.354 3.924 8.62 4.13 12.02c1.4 1.05 2.75 1.69 4.08 2.1.33-.46.62-.95.87-1.46-.48-.18-.94-.4-1.38-.66.12-.09.24-.18.36-.28 2.64 1.23 5.49 1.23 8.09 0 .12.1.24.19.36.28-.44.26-.9.48-1.38.66.25.51.54 1 .87 1.46 1.33-.41 2.68-1.05 4.08-2.1.33-5.22-.92-7.46-2.74-7.651ZM9.68 11.21c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.44-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Zm4.64 0c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.43-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                lineNumber: 263,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 262,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                            className: "rounded bg-gray-800 text-white px-2 py-1",
                                            sideOffset: 4,
                                            children: "Discord"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 269,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                    lineNumber: 261,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: facebookUrl,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                "aria-label": "Facebook",
                                                className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    viewBox: "0 0 24 24",
                                                    fill: "currentColor",
                                                    className: "w-[18px] h-[18px] text-[#1877F2]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                lineNumber: 273,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 272,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                            className: "rounded bg-gray-800 text-white px-2 py-1",
                                            sideOffset: 4,
                                            children: "Facebook"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 279,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                    lineNumber: 271,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: linkedinUrl,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                "aria-label": "LinkedIn",
                                                className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    viewBox: "0 0 24 24",
                                                    fill: "currentColor",
                                                    className: "w-[18px] h-[18px] text-[#0A66C2]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                lineNumber: 283,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 282,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                            className: "rounded bg-gray-800 text-white px-2 py-1",
                                            sideOffset: 4,
                                            children: "LinkedIn"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 289,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                    lineNumber: 281,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: githubUrl,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                "aria-label": "GitHub",
                                                className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    viewBox: "0 0 24 24",
                                                    fill: "currentColor",
                                                    className: "w-[18px] h-[18px] text-black dark:text-white",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                                lineNumber: 293,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 292,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                                            className: "rounded bg-gray-800 text-white px-2 py-1",
                                            sideOffset: 4,
                                            children: "GitHub"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                            lineNumber: 299,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                                    lineNumber: 291,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 260,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        !isSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-3 text-center text-xs text-red-500 dark:text-red-400",
                            children: "© 2026 In-Accord | GARD Realms LLC"
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                            lineNumber: 302,
                            columnNumber: 33
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                    lineNumber: 259,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-200 dark:hover:bg-gray-600",
                    onMouseDown: handleMouseDown
                }, void 0, false, {
                    fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
                    lineNumber: 304,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
            lineNumber: 214,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/client/src/app/(components)/Sidebar/index.tsx",
        lineNumber: 213,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(Sidebar, "xEmWFJzYjiCuA3L9GbX7EuNZZG4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"]
    ];
});
_c2 = Sidebar;
const __TURBOPACK__default__export__ = Sidebar;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SidebarLink");
__turbopack_context__.k.register(_c1, "SectionLabel");
__turbopack_context__.k.register(_c2, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/app/dashboardWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f28$components$292f$Navbar$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/app/(components)/Navbar/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f28$components$292f$Sidebar$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/app/(components)/Sidebar/index.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/app/redux.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const DashboardLayout = ({ children })=>{
    _s();
    const isSidebarCollapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "DashboardLayout.useAppSelector[isSidebarCollapsed]": (state)=>state.global.isSidebarCollapsed
    }["DashboardLayout.useAppSelector[isSidebarCollapsed]"]);
    const isDarkMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "DashboardLayout.useAppSelector[isDarkMode]": (state_0)=>state_0.global.isDarkMode
    }["DashboardLayout.useAppSelector[isDarkMode]"]);
    const sidebarWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "DashboardLayout.useAppSelector[sidebarWidth]": (state_1)=>state_1.global.sidebarWidth
    }["DashboardLayout.useAppSelector[sidebarWidth]"]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardLayout.useEffect": ()=>{
            const html = document.documentElement;
            if (isDarkMode) {
                html.classList.add("dark");
            } else {
                html.classList.remove("dark");
            }
            console.log('Dark mode changed to:', isDarkMode, 'HTML classes:', html.classList.value);
        }
    }["DashboardLayout.useEffect"], [
        isDarkMode
    ]);
    const minWidth = 120;
    const maxWidth = 320;
    const clampedSidebarWidth = Math.min(Math.max(sidebarWidth, minWidth), maxWidth);
    const appliedSidebarOffset = isSidebarCollapsed ? 64 : clampedSidebarWidth;
    // Redirect to home when accessing protected routes without a logged-in user
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardLayout.useEffect": ()=>{
            try {
                const raw = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('currentUser') : "TURBOPACK unreachable";
                const user = raw ? JSON.parse(raw) : null;
                const protectedRoutes = [
                    '/administrator',
                    '/dashboard',
                    '/profile',
                    '/inventory',
                    '/products',
                    '/expenses',
                    '/bots',
                    '/servers',
                    '/hosting',
                    '/users'
                ];
                const isProtected_0 = protectedRoutes.some({
                    "DashboardLayout.useEffect.isProtected_0": (p_0)=>pathname?.startsWith(p_0)
                }["DashboardLayout.useEffect.isProtected_0"]);
                if (isProtected_0 && !user) {
                    // Use replace to avoid back button returning to protected page
                    router.replace('/home');
                }
            } catch (e) {
                // Fail-safe: if parsing fails, redirect off protected routes
                const isProtected = [
                    '/administrator',
                    '/dashboard'
                ].some({
                    "DashboardLayout.useEffect.isProtected": (p)=>pathname?.startsWith(p)
                }["DashboardLayout.useEffect.isProtected"]);
                if (isProtected) router.replace('/home');
            }
        }
    }["DashboardLayout.useEffect"], [
        pathname,
        router
    ]);
    // React to auth changes (login/logout) and re-evaluate guards
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardLayout.useEffect": ()=>{
            const onAuthUpdate = {
                "DashboardLayout.useEffect.onAuthUpdate": ()=>{
                    try {
                        const raw_0 = localStorage.getItem('currentUser');
                        const user_0 = raw_0 ? JSON.parse(raw_0) : null;
                        const protectedRoutes_0 = [
                            '/administrator',
                            '/dashboard'
                        ];
                        const isProtected_1 = protectedRoutes_0.some({
                            "DashboardLayout.useEffect.onAuthUpdate.isProtected_1": (p_1)=>pathname?.startsWith(p_1)
                        }["DashboardLayout.useEffect.onAuthUpdate.isProtected_1"]);
                        if (isProtected_1 && !user_0) router.replace('/home');
                    } catch  {}
                }
            }["DashboardLayout.useEffect.onAuthUpdate"];
            window.addEventListener('userUpdated', onAuthUpdate);
            window.addEventListener('storage', onAuthUpdate);
            window.addEventListener('sessionCreated', onAuthUpdate);
            return ({
                "DashboardLayout.useEffect": ()=>{
                    window.removeEventListener('userUpdated', onAuthUpdate);
                    window.removeEventListener('storage', onAuthUpdate);
                    window.removeEventListener('sessionCreated', onAuthUpdate);
                }
            })["DashboardLayout.useEffect"];
        }
    }["DashboardLayout.useEffect"], [
        pathname,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 w-full min-h-screen",
        style: {
            backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
            color: isDarkMode ? '#f3f4f6' : '#111827'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f28$components$292f$Sidebar$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/client/src/app/dashboardWrapper.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: `flex flex-col flex-1 h-full py-7 px-6 bg-gray-50 dark:bg-gray-900`,
                style: {
                    backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                    marginLeft: 0,
                    width: '100%'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f28$components$292f$Navbar$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/client/src/app/dashboardWrapper.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/app/dashboardWrapper.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/app/dashboardWrapper.tsx",
        lineNumber: 71,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(DashboardLayout, "UAop8VHzDXgJs9uW7d3Mx3MaXUQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = DashboardLayout;
const DashboardWrapper = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "368dc2eaf82fafd3e97383bd03911edbdf04142901103254dbc43c8cf2be5989") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "368dc2eaf82fafd3e97383bd03911edbdf04142901103254dbc43c8cf2be5989";
    }
    const { children } = t0;
    let t1;
    if ($[1] !== children) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$app$2f$redux$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardLayout, {
                children: children
            }, void 0, false, {
                fileName: "[project]/client/src/app/dashboardWrapper.tsx",
                lineNumber: 99,
                columnNumber: 25
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/client/src/app/dashboardWrapper.tsx",
            lineNumber: 99,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = children;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    return t1;
};
_c1 = DashboardWrapper;
const __TURBOPACK__default__export__ = DashboardWrapper;
var _c, _c1;
__turbopack_context__.k.register(_c, "DashboardLayout");
__turbopack_context__.k.register(_c1, "DashboardWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=client_src_ad8ccc63._.js.map