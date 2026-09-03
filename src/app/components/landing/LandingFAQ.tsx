import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { faqs } from "./content";

export function LandingFAQ() {
  return (
    <Accordion.Root type="single" collapsible className="landing-accordion">
      {faqs.map((faq, index) => (
        <Accordion.Item
          className="faq-item"
          value={`faq-${index}`}
          key={faq.question}
        >
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              {faq.question}
              <Plus size={20} aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="faq-answer">
            <div>{faq.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
