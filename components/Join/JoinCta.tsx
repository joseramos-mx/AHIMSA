import CallToAction from "@/components/CallToAction";
import { WHATSAPP_AGENT_URL } from "@/lib/contact";
import { contactHref } from "@/lib/lead-types";
import { JOIN_CTA } from "@/lib/join";

/** Mismo CTA de la landing, con los textos de agentes. */
export default function JoinCta() {
  return (
    <CallToAction
      id="unete"
      eyebrow=""
      subtitle=""
      title={JOIN_CTA.title}
      primary={{
        label: "Escríbeme por WhatsApp",
        href: WHATSAPP_AGENT_URL,
        external: true,
      }}
      secondary={{ label: JOIN_CTA.formLabel, href: contactHref("agente") }}
      footnote={JOIN_CTA.disclaimer}
    />
  );
}
