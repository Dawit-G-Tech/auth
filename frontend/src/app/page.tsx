'use client'; 
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
export default function Home() {
  const {t} = useTranslation();
  
  return (
    //<p className="font-semibold">Hello Auth!</p>
    <div>
      <Button size="lg">{t("plularization", {
        count: 1,
      })}</Button>

      <Button size="sm">{t("welcomeMessage")}</Button>
    </div>
  )
}