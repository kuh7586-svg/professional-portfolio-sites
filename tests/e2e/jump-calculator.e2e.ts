// Generated from tests/e2e/specs/jump-calculator.json (spec 6eae8f3dce519298). Edit the spec, not this file.
import { test } from "@e2e-dev/web";
import type { Locator, Screen } from "e2e";
import { expect } from "e2e";

/** Steps this flow's recording found already done; strict replay skips them, as they have nothing to replay. */
const skippedSteps: readonly number[] = JSON.parse(process.env.CAFFEINE_E2E_SKIP_STEPS ?? "[]");

const recording = process.env.CAFFEINE_E2E_MODE === "record" || process.env.CAFFEINE_E2E_MODE === "heal";

/** Whether `holds` turns true within the assertion timeout. */
async function eventually(holds: () => Promise<boolean>): Promise<boolean> {
  const deadline = Date.now() + 5000;
  for (;;) {
    if (await holds()) return true;
    if (Date.now() >= deadline) return false;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

function flowChecks() {
  let failed = 0;
  return {
    /** Spec check `index`: a failure fails a strict replay at once and is kept otherwise. */
    async check(index: number, verify: () => Promise<void>, holds: () => Promise<boolean>): Promise<void> {
      if (!recording) return verify();
      if (failed === 0) {
        try {
          return await verify();
        } catch (error) {
          if ((error as { code?: unknown }).code !== "ASSERTION_FAILED") throw error;
        }
      } else if (await eventually(holds)) {
        return;
      }
      failed += 1;
      expect.soft(false, `check ${String(index)}`).toBe(true);
    },
  };
}

/** `text` as a case-insensitive pattern in which each run of spaces also matches none. */
function spacedText(text: string): RegExp {
  const words = text.trim().split(/\s+/).map((word) => word.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&"));
  return new RegExp(words.join("\\s*"), "i");
}

/** Words the screen shows: visible text, the placeholder of an input that shows it, or a field that holds it right after the step that typed it. */
async function shownText(screen: Screen, text: string, typed = false, pattern?: RegExp): Promise<Locator> {
  const asText = screen.getByText(pattern ?? spacedText(text), { visible: true }).first();
  const field = pattern === undefined ? { exact: false, visible: true } : { exact: true, visible: true };
  const asPlaceholder = screen.getByPlaceholder(text, field).first();
  const asValue = screen.getByDisplayValue(text, field).first();
  for (let waited = 0; waited < 5000; waited += 250) {
    if (await asText.isVisible()) return asText;
    if (await asPlaceholder.isVisible()) return asPlaceholder;
    if (typed && (await asValue.isVisible())) return asValue;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return asText;
}

test("jump-calculator", async ({ app, agent, screen }) => {
  const flow = flowChecks();
  await app.open("/work/jump");

  if (!skippedSteps.includes(0)) await agent.act("Increase the number of adults by one in the ticket calculator\nDo not do the next step yet: Switch the calculator to Выходные", { maxModelCalls: 20 });
  await flow.check(0, async () => { await expect(await shownText(screen, "Итого")).toBeVisible({ timeout: 15000 }); }, async () => (await shownText(screen, "Итого")).isVisible());

  if (!skippedSteps.includes(1)) await agent.act("Switch the calculator to Выходные\nDo not do the next step yet: Choose 120 minutes in the calculator", { maxModelCalls: 20 });
  await flow.check(1, async () => { await expect(await shownText(screen, "Выходные", true)).toBeVisible(); }, async () => (await shownText(screen, "Выходные", true)).isVisible());

  if (!skippedSteps.includes(2)) await agent.act("Choose 120 minutes in the calculator", { maxModelCalls: 20 });
  await flow.check(2, async () => { await expect(await shownText(screen, "120", true, new RegExp("(?<![\\d.,+*\\u00D7xX\\u2212-])(?<!\\d[/:,])120(?!\\d|[-/:.,\\s\\u00D7xX*]\\d)"))).toBeVisible(); }, async () => (await shownText(screen, "120", true, new RegExp("(?<![\\d.,+*\\u00D7xX\\u2212-])(?<!\\d[/:,])120(?!\\d|[-/:.,\\s\\u00D7xX*]\\d)"))).isVisible());
});
