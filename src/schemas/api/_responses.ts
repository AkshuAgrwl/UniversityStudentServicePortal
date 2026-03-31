const SERVER_ERROR_CODE = "E-001";

export const SAPIResponseSuccess = <T, M = undefined>(data: T, meta?: M) => ({
  status: "SUCCESS" as const,
  data: data,
  ...(meta !== undefined && { meta }),
});

export const SAPIResponseSuccessNoData = <M = undefined>(
  msg: string,
  meta?: M,
) => ({
  status: "SUCCESS" as const,
  message: msg,
  ...(meta !== undefined && { meta }),
});

export const SAPIResponseError = (
  code: string,
  msg: string,
  desc: string = "Something went wrong",
) => ({
  status: "ERROR" as const,
  error: {
    code: code,
    message: msg,
    description: desc,
  },
});

export const SAPIServerError = (
  error: unknown,
  desc: string = "An unknown error occured",
) => {
  console.error(error);
  return SAPIResponseError(SERVER_ERROR_CODE, "Internal Server Error", desc);
};
