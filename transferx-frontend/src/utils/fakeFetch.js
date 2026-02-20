// Simulates network delay for mock data. Remove when backend is connected.
export const fakeFetch = (data, delay = 600) =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));
