import { createBrowserRouter, Outlet } from "react-router";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ManualPage } from "./components/ManualPage";
import { PlaygroundPage } from "./components/PlaygroundPage";

function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "manual", Component: ManualPage },
      { path: "playground", Component: PlaygroundPage },
    ],
  },
]);
