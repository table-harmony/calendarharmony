import { AccountDto, GetAccountByUser, GetAccounts } from "../types";

export async function getAccountByUserUseCase(
  context: {
    getAccountByUser: GetAccountByUser;
  },
  data: { userId: string }
): Promise<AccountDto | undefined> {
  try {
    const foundAccount = await context.getAccountByUser(data.userId);

    return foundAccount;
  } catch (error) {
    console.error("[GET_ACCOUNT_BY_USER_USE_CASE]: ERROR", error);
  }
}

export async function getAccountsUseCase(context: {
  getAccounts: GetAccounts;
}): Promise<AccountDto[]> {
  const foundAccounts = await context.getAccounts();

  return foundAccounts;
}