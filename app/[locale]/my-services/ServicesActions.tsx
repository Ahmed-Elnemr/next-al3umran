  "use client";

  import { useState } from "react";
  import { FiEye, FiTrash2 } from "react-icons/fi";
  import { useTranslations, useLocale } from "next-intl";
  import Link from "next/link";
  import DeleteServiceModal from "./DeleteServiceModal";

  const ServicesActions = ({ service, token, type = "service" }: { service: any, token: string, type?: "service" | "property" }) => {
    const t = useTranslations("services");
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [openDelete, setOpenDelete] = useState(false);

    return (
      <>
        <div className="flex gap-3 pt-4">
          <Link
            href={`/${locale}/${type === "property" ? "properties" : "services"}/${service.id}`}
            className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary rounded-lg py-2 text-sm hover:bg-primary hover:text-white transition"
          >
            <FiEye />
            {isAr ? "عرض التفاصيل" : "View Details"}
          </Link>

          <button
            onClick={() => setOpenDelete(true)}
            className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-500 rounded-lg py-2 text-sm hover:bg-red-500 hover:text-white transition"
          >
            <FiTrash2 />
            {t("delete")}
          </button>
        </div>

        <DeleteServiceModal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          serviceId={service.id}
          token={token}
          type={type}
        />
      </>
    );
  };

  export default ServicesActions;
