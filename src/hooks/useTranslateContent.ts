import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TranslateResult {
  translations: Record<string, Record<string, string>>;
}

export function useTranslateContent() {
  const [translating, setTranslating] = useState(false);

  const translateFields = async (
    fields: Record<string, string>,
    sourceLang: string = "en"
  ): Promise<Record<string, Record<string, string>> | null> => {
    setTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-content", {
        body: { fields, sourceLang },
      });

      if (error) {
        toast({ title: "Translation failed", description: error.message, variant: "destructive" });
        return null;
      }

      const result = data as TranslateResult;
      toast({ title: "✅ Translated!", description: "Content translated to all languages." });
      return result.translations;
    } catch (err: any) {
      toast({ title: "Translation error", description: err.message, variant: "destructive" });
      return null;
    } finally {
      setTranslating(false);
    }
  };

  return { translateFields, translating };
}
