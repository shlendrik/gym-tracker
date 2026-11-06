import { describe, expect, it } from "vitest";
import { countLabel, pluralize } from "./format";

describe("склонение", () => {
  it("упражнение / упражнения / упражнений", () => {
    const f = (n: number) => pluralize(n, "упражнение", "упражнения", "упражнений");
    expect(f(1)).toBe("упражнение");
    expect(f(2)).toBe("упражнения");
    expect(f(5)).toBe("упражнений");
    expect(f(11)).toBe("упражнений");
    expect(f(12)).toBe("упражнений");
    expect(f(21)).toBe("упражнение");
    expect(f(22)).toBe("упражнения");
  });

  it("countLabel собирает число и слово", () => {
    expect(countLabel(3, "подход", "подхода", "подходов")).toBe("3 подхода");
  });
});
