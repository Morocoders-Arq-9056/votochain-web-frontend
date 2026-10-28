import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpInput } from "./OtpInput";

describe("OtpInput", () => {
  it("renderiza seis celdas etiquetadas", () => {
    render(<OtpInput value="" onChange={() => undefined} />);

    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(screen.getByLabelText("Dígito 1 de 6")).toBeInTheDocument();
  });

  it("propaga el código escrito", async () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("Dígito 1 de 6"), "4");
    expect(onChange).toHaveBeenCalledWith("4");
  });

  it("descarta los caracteres que no son dígitos", async () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("Dígito 1 de 6"), "a");
    expect(onChange).not.toHaveBeenCalled();
  });
});
