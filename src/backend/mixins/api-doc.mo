mixin () {
  public query func getApiDoc() : async Text {
    "# Portfolio backend API\n" #
    "\n" #
    "## Purpose\n" #
    "This canister backs a portfolio showcase website. All portfolio content (demo sites, animations, 3D scenes, music) lives in the frontend; the backend stores no portfolio data. It exposes only role-based access control and an empty OQL query surface.\n" #
    "\n" #
    "## Authentication and identity\n" #
    "- Anonymous callers are allowed on every method. `getCallerUserRole` returns `#guest` for the anonymous principal; `isCallerAdmin` returns `false`.\n" #
    "- `assignCallerUserRole` requires a signed (non-anonymous) caller who is registered as admin.\n" #
    "- The frontend pins an Internet Identity derivation origin, published at `/.well-known/ii-derivation-origin` when available. An agent already holding the user's Internet Identity authorization derives the correct per-app principal against that origin (for example `icp identity link web <name> --app <host>`). Such a delegation acts with the user's full authority in this app until it expires.\n" #
    "- A principal derived against a different origin is a different principal from the one the frontend registered.\n" #
    "\n" #
    "## Registration\n" #
    "- A signed-in caller registers by calling `_initialize_access_control()` once (the frontend also registers during `_internet_identity_sign_in_finish`). Registration happens only when a caller signs in through the app's own frontend or calls this method directly, so a principal that never did so is unregistered even if it belongs to the app's owner.\n" #
    "- The first non-anonymous principal ever to initialize becomes `#admin`; every later one becomes `#user`. Calling again is a no-op and never changes an existing role. Anonymous calls are ignored.\n" #
    "- An unregistered, non-anonymous caller of `getCallerUserRole` or `isCallerAdmin` gets a trap: `User is not registered`. For `assignCallerUserRole`, that same trap is raised before the admin check.\n" #
    "\n" #
    "## Methods\n" #
    "- `_initialize_access_control() : async ()` - update. Registers the caller as described above. Idempotent, safe to retry.\n" #
    "- `_internet_identity_sign_in_start() : async Blob` - update. Issues a sign-in challenge used by the frontend's Internet Identity attribute flow.\n" #
    "- `_internet_identity_sign_in_finish() : async Result<(), Error>` - update. Registers the caller (same rules as `_initialize_access_control`), then verifies the pending challenge, returning `#err` on verification failure. Registration is kept even when verification fails. Intended for the frontend sign-in flow.\n" #
    "- `getCallerUserRole() : async UserRole` - query. Returns `#admin`, `#user` or `#guest` for the caller.\n" #
    "- `isCallerAdmin() : async Bool` - query. True only for a registered admin.\n" #
    "- `assignCallerUserRole(user : Principal, role : UserRole) : async ()` - update. Admin only; sets `user`'s role (overwriting any prior role, and registering `user` if new). Non-admin callers get the trap `Unauthorized: Only admins can assign user roles`. Idempotent: repeating the same call yields the same state. Assigning `#user` or `#guest` to yourself removes your own admin rights permanently unless another admin restores them.\n" #
    "- `schema()` / `execute(query)` - OQL query endpoints from the Expose mixin. No entities are registered, so the schema is empty and queries return no tables.\n" #
    "\n" #
    "## Types and encoding\n" #
    "- `UserRole` is a Candid variant: `variant { admin; user; guest }`.\n" #
    "- Principals are Candid principals (textual form in tools).\n" #
    "- No timestamps, amounts or blobs are stored by this backend.\n" #
    "\n" #
    "## Lifecycle, polling, retries\n" #
    "- There are no background jobs, state transitions to poll, or asynchronous completion conditions.\n" #
    "- All updates are idempotent; retrying after a network error is safe.\n" #
    "- Traps reject the call and roll back its state changes; they are not returned as values."
  };
};
