type Integration = { connected: boolean; accessToken?: string; profile?: any } | undefined;

const store: { github?: Integration; discord?: Integration } = {};

export default store;
