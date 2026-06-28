#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const SKILL_NAME = "embedded-uiux-walkthrough";
const SOURCE_DIR = path.resolve(__dirname, "..", "skills", SKILL_NAME);
const SOURCE_SKILL = path.join(SOURCE_DIR, "SKILL.md");

function help() {
  console.log(`embedded-uiux-walkthrough

Install the Embedded UI/UX Walkthrough agent skill.

Usage:
  npx github:Tanwyhang/embedded-uiux-walkthrough install [options]
  npx embedded-uiux-walkthrough install [options]

Commands:
  install       Copy SKILL.md into a skill directory (default)
  print         Print the bundled SKILL.md
  help          Show this help

Options:
  --target <project|opencode|agents|claude>  Install location preset. Default: project
  --dir <path>                               Custom skill parent or destination directory
  --force                                    Overwrite an existing SKILL.md
  --help                                     Show this help

Targets:
  project/opencode  ./.agents/skills/embedded-uiux-walkthrough
  agents            ~/.agents/skills/embedded-uiux-walkthrough
  claude            ~/.claude/skills/embedded-uiux-walkthrough

Examples:
  npx github:Tanwyhang/embedded-uiux-walkthrough install
  npx github:Tanwyhang/embedded-uiux-walkthrough install --target claude
  npx github:Tanwyhang/embedded-uiux-walkthrough install --dir ./.agents/skills --force
`);
}

function parseArgs(argv) {
  const args = [...argv];
  const command = args[0] && !args[0].startsWith("--") ? args.shift() : "install";
  const options = { command, target: "project", dir: undefined, force: false, help: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--target") options.target = args[++index];
    else if (arg.startsWith("--target=")) options.target = arg.slice("--target=".length);
    else if (arg === "--dir") options.dir = args[++index];
    else if (arg.startsWith("--dir=")) options.dir = arg.slice("--dir=".length);
    else throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function resolveDestination(options) {
  if (options.dir) {
    const requested = path.resolve(process.cwd(), options.dir);
    return path.basename(requested) === SKILL_NAME ? requested : path.join(requested, SKILL_NAME);
  }

  if (options.target === "project" || options.target === "opencode") {
    return path.join(process.cwd(), ".agents", "skills", SKILL_NAME);
  }

  if (options.target === "agents") {
    return path.join(os.homedir(), ".agents", "skills", SKILL_NAME);
  }

  if (options.target === "claude") {
    return path.join(os.homedir(), ".claude", "skills", SKILL_NAME);
  }

  throw new Error(`Unsupported target: ${options.target}`);
}

function install(options) {
  if (!fs.existsSync(SOURCE_SKILL)) {
    throw new Error(`Bundled skill not found: ${SOURCE_SKILL}`);
  }

  const destination = resolveDestination(options);
  const destinationSkill = path.join(destination, "SKILL.md");

  if (fs.existsSync(destinationSkill) && !options.force) {
    throw new Error(`Skill already exists at ${destinationSkill}. Re-run with --force to overwrite it.`);
  }

  fs.mkdirSync(destination, { recursive: true });
  fs.copyFileSync(SOURCE_SKILL, destinationSkill);

  console.log(`Installed ${SKILL_NAME} to ${destinationSkill}`);
}

function printSkill() {
  process.stdout.write(fs.readFileSync(SOURCE_SKILL, "utf8"));
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || options.command === "help") {
    help();
    return;
  }

  if (options.command === "install") {
    install(options);
    return;
  }

  if (options.command === "print") {
    printSkill();
    return;
  }

  throw new Error(`Unknown command: ${options.command}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
