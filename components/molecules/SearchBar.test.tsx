import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("etiqueta el buscador y propaga la consulta", async () => {
    const onSearch = vi.fn();
    render(
      <SearchBar label="Buscar miembro" value="" onSearch={onSearch} />,
    );

    await userEvent.type(screen.getByLabelText("Buscar miembro"), "Qu");
    expect(onSearch).toHaveBeenCalledWith("Q");
  });
});
