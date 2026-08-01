import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ToolLayout } from "@/components/ToolLayout";
import { tools } from "@/tools";

const tool = tools.find((candidate) => candidate.faqs.length > 0) ?? tools[0];

describe("ToolLayout FAQ accordion", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders every FAQ question collapsed by default", () => {
    render(
      <ToolLayout tool={tool}>
        <div>workspace</div>
      </ToolLayout>,
    );

    for (const faq of tool.faqs) {
      const trigger = screen.getByRole("button", { name: faq.question });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("expands and collapses an FAQ item on click", async () => {
    const user = userEvent.setup();
    render(
      <ToolLayout tool={tool}>
        <div>workspace</div>
      </ToolLayout>,
    );

    const firstFaq = tool.faqs[0];
    const trigger = screen.getByRole("button", { name: firstFaq.question });

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(firstFaq.answer)).toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not render a Related developer tools section", () => {
    render(
      <ToolLayout tool={tool}>
        <div>workspace</div>
      </ToolLayout>,
    );

    expect(screen.queryByText(/related developer tools/i)).not.toBeInTheDocument();
  });
});
