import { execa } from "execa";
import type { CommandResult } from "./types/index.js";

export async function runCommand(command: string) {
  try {
    const [commandName, ...args] = command.split(" ");

    const { stdout } = await execa(commandName as string, args, {
      stdio: "inherit",
    });
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

/**
 * Takes the interactive and non interactive command from each item in the CommandResult Array
 */
export async function install(commands: CommandResult[]) {
  for (const command of commands) {
    // Wait for ALL interactive commands to finish first
    if (command.interactive) {
      for (const interactiveCommand of command.interactive) {
        await runCommand(interactiveCommand);
      }
    }

    // Then run non-interactive
    if (command.nonInteractive) {
      await runCommand(command.nonInteractive[0] as string);
    }
  }
}
