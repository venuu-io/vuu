//Testing for issue #639
import { describe, expect, it } from "vitest";
import { applyWidthToColumns } from "../src/column-utils";
import type { RuntimeColumnDescriptor } from "@finos/vuu-table-types";

describe("applyWidthToColumns applies static width to columns correctly", () => {
  describe("static layouts", () => {
    it("defaults to static layout, all width applied by user", () => {
      const columns: Partial<F>[] = [
        { name: "id", label: "ID", width: 100, key: 0 },
        { name: "id", label: "ID", width: 100, key: 1 },
        { name: "id", label: "ID", width: 100, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Static",
      });

      expect(result).toEqual(columns);
    });

    it("defaults to static layout, no width applied by user", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "id", label: "ID", key: 0 },
        { name: "id", label: "ID", key: 1 },
        { name: "id", label: "ID", key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Static",
      });

      expect(result).toEqual([
        { name: "id", label: "ID", width: 100, key: 0 },
        { name: "id", label: "ID", width: 100, key: 1 },
        { name: "id", label: "ID", width: 100, key: 2 },
      ]);
    });

    it("defaulting to static but pass default width of 80", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "id", label: "ID", width: 80, key: 0 },
        { name: "id", label: "ID", width: 80, key: 1 },
        { name: "id", label: "ID", width: 80, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Static",
        defaultWidth: 80,
      });

      expect(result).toEqual([
        { name: "id", label: "ID", width: 80, key: 0 },
        { name: "id", label: "ID", width: 80, key: 1 },
        { name: "id", label: "ID", width: 80, key: 2 },
      ]);
    });

    it("defaults to static when width exceeds available width", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "id", label: "ID", width: 400, key: 0 },
        { name: "id", label: "ID", width: 300, key: 1 },
        { name: "id", label: "ID", width: 500, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Static",
      });

      expect(result).toEqual(columns);
    });
  });
});

describe("apply Fit Function to columns correctly", () => {
  describe("Fit layouts", () => {
    it("applies fit layout when the total column width is less than available width", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 80, key: 0 },
        { name: "ID", label: "id", width: 80, key: 1 },
        { name: "ID", label: "id", width: 80, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 300,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 100, key: 0 },
        { name: "ID", label: "id", width: 100, key: 1 },
        { name: "ID", label: "id", width: 100, key: 2 },
      ]);
    });

    it("applies fit layout when the total column width is greater than available width", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 120, key: 0 },
        { name: "ID", label: "id", width: 120, key: 1 },
        { name: "ID", label: "id", width: 120, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 300,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 100, key: 0 },
        { name: "ID", label: "id", width: 100, key: 1 },
        { name: "ID", label: "id", width: 100, key: 2 },
      ]);
    });

    it("applies fit layout when the total column width is greater than available width, one column minWidth", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 120, key: 0 },
        { name: "ID", label: "id", width: 120, minWidth: 120, key: 1 },
        { name: "ID", label: "id", width: 120, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 300,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 90, key: 0 },
        { name: "ID", label: "id", width: 120, minWidth: 120, key: 1 },
        { name: "ID", label: "id", width: 90, key: 2 },
      ]);
    });

    it("applies fit layout when the total column width is greater than available width, two have a minWidth", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 120, key: 0 },
        { name: "ID", label: "id", width: 120, minWidth: 105, key: 1 },
        { name: "ID", label: "id", width: 120, minWidth: 110, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 300,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 85, key: 0 },
        { name: "ID", label: "id", width: 105, minWidth: 105, key: 1 },
        { name: "ID", label: "id", width: 110, minWidth: 110, key: 2 },
      ]);
    });

    it("does not change columns when columns fit", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 80, maxWidth: 150, key: 0 },
        { name: "ID", label: "id", width: 80, maxWidth: 150, key: 1 },
        { name: "ID", label: "id", width: 80, maxWidth: 150, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 300,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 100, maxWidth: 150, key: 0 },
        { name: "ID", label: "id", width: 100, maxWidth: 150, key: 1 },
        { name: "ID", label: "id", width: 100, maxWidth: 150, key: 2 },
      ]);
    });

    it("applies fit layout when the total column width is less than the available width, and one column has maxWidth", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 70, key: 0 },
        { name: "ID", label: "id", width: 70, maxWidth: 150, key: 1 },
        { name: "ID", label: "id", width: 70, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 300,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 100, key: 0 },
        { name: "ID", label: "id", width: 100, maxWidth: 150, key: 1 },
        { name: "ID", label: "id", width: 100, key: 2 },
      ]);
    });

    it("applies fit layout when the total column width is less than the available width, and two column has maxWidth", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 90, maxWidth: 120, key: 0 },
        { name: "ID", label: "id", width: 90, maxWidth: 110, key: 1 },
        { name: "ID", label: "id", width: 90, key: 1 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 300,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 100, maxWidth: 120, key: 0 },
        { name: "ID", label: "id", width: 100, maxWidth: 110, key: 1 },
        { name: "ID", label: "id", width: 100, key: 1 },
      ]);
    });

    it("applies defaultMinWidth when minWidth is not provided"),
      () => {
        const columns: Partial<RuntimeColumnDescriptor>[] = [
          { name: "ID", label: "id", width: 100, key: 0 },
          { name: "ID", label: "id", key: 1 },
          { name: "ID", label: "id", key: 2 },
        ];

        const result = applyWidthToColumns(
          columns as RuntimeColumnDescriptor[],
          {
            columnLayout: "Fit",
            availableWidth: 300,
            defaultMinWidth: 50,
          }
        );

        expect(result).toEqual([
          { name: "ID", label: "id", width: 50, key: 0 },
          { name: "ID", label: "id", width: 50, key: 1 },
          { name: "ID", label: "id", width: 60, key: 2 },
        ]);
      };

    it("applies defaultMaxWidth when maxWidth is not exceeded"),
      () => {
        const columns: Partial<RuntimeColumnDescriptor>[] = [
          { name: "ID", label: "id", width: 100, key: 0 },
          { name: "ID", label: "id", width: 150, maxWidth: 250, key: 1 },
          { name: "ID", label: "id", width: 100, key: 2 },
        ];

        const result = applyWidthToColumns(
          columns as RuntimeColumnDescriptor[],
          {
            columnLayout: "Fit",
            availableWidth: 500,
            defaultMaxWidth: 250,
          }
        );

        expect(result).toEqual([
          { name: "ID", label: "id", width: 100, key: 0 },
          { name: "ID", label: "id", width: 150, maxWidth: 200, key: 1 },
          { name: "ID", label: "id", width: 150, maxWidth: 250, key: 2 },
        ]);
      };

    it("applies defaultMaxWidth when no maxWidth is provided"),
      () => {
        const columns: Partial<RuntimeColumnDescriptor>[] = [
          { name: "ID", label: "id", width: 100, key: 0 },
          { name: "ID", label: "id", width: 150, key: 1 },
          { name: "ID", label: "id", width: 100, key: 2 },
        ];

        const result = applyWidthToColumns(
          columns as RuntimeColumnDescriptor[],
          {
            columnLayout: "Fit",
            availableWidth: 500,
            defaultMaxWidth: 200,
          }
        );

        expect(result).toEqual([
          { name: "ID", label: "id", width: 100, key: 0 },
          { name: "ID", label: "id", width: 150, maxWidth: 200, key: 1 },
          { name: "ID", label: "id", width: 200, maxWidth: 200, key: 2 },
        ]);
      };

    it("Equally assigns surplus when no minWidth and no maxWidth is provided", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", key: 0 },
        { name: "ID", label: "id", key: 1 },
        { name: "ID", label: "id", key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 500,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 166.66666666666669, key: 0 },
        { name: "ID", label: "id", width: 166.66666666666669, key: 1 },
        { name: "ID", label: "id", width: 166.66666666666669, key: 2 },
      ]);
    });
  });
});

describe("Applies Flex layout correctly", () => {
  describe("Flex Layout", () => {
    it("applies flex layout with excess width", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 200, flex: 1, key: 0 },
        { name: "ID", label: "id", width: 200, key: 1 },
        { name: "ID", label: "id", width: 200, flex: 1, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 700,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 250, flex: 1, key: 0 },
        { name: "ID", label: "id", width: 200, key: 1 },
        { name: "ID", label: "id", width: 250, flex: 1, key: 2 },
      ]);
    });

    it("applies flex layout won one of five columns", () => {
      const columns: Partial<RuntimeColumnDescriptor>[] = [
        { name: "ID", label: "id", width: 100, key: 0 },
        { name: "ID", label: "id", width: 100, key: 1 },
        { name: "ID", label: "id", width: 200, flex: 1, key: 2 },
        { name: "ID", label: "id", width: 100, key: 1 },
        { name: "ID", label: "id", width: 100, key: 2 },
      ];

      const result = applyWidthToColumns(columns as RuntimeColumnDescriptor[], {
        columnLayout: "Fit",
        availableWidth: 500,
      });

      expect(result).toEqual([
        { name: "ID", label: "id", width: 100, key: 0 },
        { name: "ID", label: "id", width: 100, key: 1 },
        { name: "ID", label: "id", width: 100, flex: 1, key: 2 },
        { name: "ID", label: "id", width: 100, key: 1 },
        { name: "ID", label: "id", width: 100, key: 2 },
      ]);
    });
  });
});