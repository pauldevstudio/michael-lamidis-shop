/**
 * Thin axios wrapper for client-side calls.
 */
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
