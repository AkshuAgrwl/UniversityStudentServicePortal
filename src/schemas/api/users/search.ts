import {
  SAPIResponseError,
  SAPIResponseSuccess,
  SAPIServerError,
} from "../_responses";

const ERROR_CODE_PREFIX = "E-010";

type TAPIUsersSearchUserData = {
  name: string | null;
  email: string;
  image: string | null;
};

type TAPIUsersSearchGETSuccessResponseData = TAPIUsersSearchUserData[];

export const SAPIUsersSearchGETResponse = {
  SUCCESS: (data: TAPIUsersSearchGETSuccessResponseData) =>
    SAPIResponseSuccess(data),
  ERROR: {
    BADREQUEST: (code: string, msg: string, desc?: string) =>
      SAPIResponseError(`${ERROR_CODE_PREFIX}-${code}`, msg, desc),
    NOTFOUND: (code: string, msg: string, desc?: string) =>
      SAPIResponseError(`${ERROR_CODE_PREFIX}-${code}`, msg, desc),
    CRASH: (error: unknown) =>
      SAPIServerError(error, "Some error occured while searching users"),
  },
};

type TAPIUsersSearchGETSuccessResponse = ReturnType<
  typeof SAPIUsersSearchGETResponse.SUCCESS
>;
type TAPIUsersSearchGETErrorResponse =
  | ReturnType<typeof SAPIUsersSearchGETResponse.ERROR.BADREQUEST>
  | ReturnType<typeof SAPIUsersSearchGETResponse.ERROR.NOTFOUND>
  | ReturnType<typeof SAPIUsersSearchGETResponse.ERROR.CRASH>;

type TAPIUsersSearchGETResponse =
  | TAPIUsersSearchGETSuccessResponse
  | TAPIUsersSearchGETErrorResponse;

export type {
  TAPIUsersSearchUserData,
  TAPIUsersSearchGETSuccessResponseData,
  TAPIUsersSearchGETSuccessResponse,
  TAPIUsersSearchGETErrorResponse,
  TAPIUsersSearchGETResponse,
};
