{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "my-project"
, dependencies =
  [ "console", "effect", "p5", "psci-support", "web-html" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
