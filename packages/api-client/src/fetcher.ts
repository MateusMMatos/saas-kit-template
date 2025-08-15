export const customFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, { ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
};
