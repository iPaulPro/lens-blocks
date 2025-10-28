export type Result<T, E = never> = {
  data: T | null | undefined;
  error: E | null | undefined;
  loading: boolean;
};

export const isResult = <T, E = never>(result: any): result is Result<T, E> => {
  return "data" in result && "error" in result && "loading" in result;
};

export const isLoading = (result: any): boolean => {
  if (isResult(result)) {
    return result.loading;
  }
  return false;
};
