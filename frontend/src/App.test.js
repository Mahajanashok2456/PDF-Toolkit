import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Mock matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };PDF Toolkit

test("renders PDF Toolkit header", async () => {PDF Toolkit
  render(<App Router={MemoryRouter} />);
  const headerElements = await screen.findAllByText(/PDF Toolkit/i);
  expect(headerElements.length).toBeGreaterThan(0);
});

test("renders dashboard content", async () => {
  render(<App Router={MemoryRouter} />);
  const dashboardTitle = await screen.findByText(/Powerful PDF Toolkit/i);
  expect(dashboardTitle).toBeInTheDocument();
});

test("renders privacy policy link", async () => {
  render(<App Router={MemoryRouter} />);
  const privacyLink = await screen.findByText(/Privacy Policy/i);
  expect(privacyLink).toBeInTheDocument();
});
