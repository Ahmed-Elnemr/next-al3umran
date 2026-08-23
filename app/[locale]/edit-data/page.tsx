import React from "react";
import Container from "../../../src/components/shared/container";
import EditDataForm from "./EditDataForm";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("profile");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  const clientType = cookieStore.get("client_type")?.value;
  const userDataString = cookieStore.get("userDataInfo")?.value;

  let userData: { client_type?: string } | null = null;
  if (userDataString) {
    try {
      userData = JSON.parse(userDataString);
    } catch {
      userData = null;
    }
  }

  const role = clientType || userData?.client_type || "customer";

  return (
    <Container className="mt-10 min-h-screen">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="text-center">
          <h2 className="font-extrabold text-[29px] text-primary">
            {t("editTitle")}
          </h2>

          <h4 className="text-lg font-medium text-[#989898]">
            {t("editSubtitle")}
          </h4>
        </div>

        <EditDataForm token={token} role={role} />
      </div>
    </Container>
  );
};

export default page;
