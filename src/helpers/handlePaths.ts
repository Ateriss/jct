import path from "path";


export const getCurrentPath = (): string => {
  return process.cwd();
};


 const normalizePath = (p: string): string => {
  return path.resolve(p.trim());
};


 export const isSamePath = (p1: string, p2: string): boolean => {
  return normalizePath(p1) === normalizePath(p2);
};


export const isCurrentPath = (targetPath: string): boolean => {
  const current = getCurrentPath();
  return isSamePath(current, targetPath);
};


export const isInsidePath = (basePath: string): boolean => {
  const current = normalizePath(getCurrentPath());
  const base = normalizePath(basePath);

  return current.startsWith(base + path.sep);
};

