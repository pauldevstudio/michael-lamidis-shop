/* THIS FILE IS GENERATED FOR PAYLOAD. Do not hand-edit. */
import type { ServerFunctionClient } from "payload";
import config from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import { importMap } from "./importMap.js";

// Payload's full admin CSS bundle. WITHOUT this import the admin is
// completely unstyled (giant SVG icons, no layout).
import "@payloadcms/next/css";
import "./custom.scss";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) =>
  RootLayout({ config, children, importMap, serverFunction });

export default Layout;
