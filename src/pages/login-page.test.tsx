import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./login-page";

vi.mock("../stores/auth-store", () => ({
  useAuthStore: () => ({
    error: null,
    isLoading: false,
    loadUser: vi.fn().mockResolvedValue(null),
  }),
}));

const assign = vi.fn();

vi.mock("../lib/auth", () => ({
  startGoogleLogin: () => assign("http://localhost:3000/auth/login/google"),
}));

describe("LoginPage", () => {
  it("renders the Google login action", async () => {
    render(<LoginPage />);

    const button = screen.getByRole("button", { name: /belépés google-fiókkal/i });
    await userEvent.click(button);

    expect(screen.getByRole("heading", { name: "Belépés" })).toBeInTheDocument();
    expect(assign).toHaveBeenCalledWith("http://localhost:3000/auth/login/google");
  });
});
