// Starlight exposes some internal components through virtual modules whose
// types aren't reachable from the outside. PageFrame.astro override imports
// this one, so we have to declare it here:
declare module "virtual:starlight/components/MobileMenuToggle" {
  const MobileMenuToggle: typeof import("@astrojs/starlight/components/MobileMenuToggle.astro").default;
  export default MobileMenuToggle;
}
