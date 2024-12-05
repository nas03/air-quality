import { verifyJWTToken } from "@/helpers/utils/utils";

test("verify token", () => {
  expect(verifyJWTToken(1, "f").valueOf());
});
