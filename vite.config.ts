import { defineConfig } from "vite";

export default defineConfig(() => {
  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const owner = process.env.GITHUB_REPOSITORY?.split("/")[0];
  const isUserOrOrgPagesRepo = repository === `${owner}.github.io`;

  return {
    base:
      process.env.GITHUB_ACTIONS && repository && !isUserOrOrgPagesRepo
        ? `/${repository}/`
        : "/",
  };
});
