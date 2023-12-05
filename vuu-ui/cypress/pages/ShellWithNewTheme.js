import { formatDate } from "@finos/vuu-utils";
import { SHELL_WITH_NEW_THEME_URL } from "../support/e2e/constants";

export class ShellWithNewTheme {
  visit() {
    cy.visit(SHELL_WITH_NEW_THEME_URL);
  }

  getContextMenuButton() {
    return cy
      .findByRole("tablist", { name: "layouts" })
      .findAllByRole("tab")
      .first()
      .findByRole("button", { name: "context menu" });
  }

  getSaveLayoutButton() {
    return cy.findByRole("menuitem", { name: "Save Layout" });
  }

  getMyLayoutsButton() {
    return cy.findByRole("tab", { name: "MY LAYOUTS" });
  }

  getSavedLayoutButton(layoutName, creator, date) {
    const elementName = `${layoutName} ${creator}, ${formatDate(date)}`;

    return cy.findByRole("button", { name: elementName });
  }
}
