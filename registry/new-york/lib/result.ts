export type Result<T, E = never> = {
  data: T | null | undefined;
  error?: E | null | undefined;
  loading?: boolean;
};
