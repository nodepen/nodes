import { SpeckleRequestContext } from "@/sdk/types";

/**
 * Ensure the authenticated speckle user can interact with required workspace data
 */
export const ensureWorkspaceAccess =
  (context: SpeckleRequestContext) =>
    async () => {
      // Get nodepen workspace id
      // Get user project id from nodepen db

      // If no project in nodepen db:
      // - (Admin) Create a project
      // Set user project in nodepen db

      // EnsureNodePenConnection query (get workspace and project roles)

      // If workspace not found error, bail (catastrophic)
      // TODO: If project not found, heal somehow. But this is only if Speckle folks fuck with their project.

      // If no workspace role:
      // - (Admin) Invite to workspace
      // - (user) Get and accept invite
      // - (Admin) Set seat to editor
    }