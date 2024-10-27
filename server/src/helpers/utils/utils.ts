import childProcess from "child_process";

export const executeCommand = async (command: string): Promise<boolean> => {
  try {
    const process = childProcess.exec(command);
    await new Promise((resolve) => {
      process.on("close", resolve);
    });
    return true;
  } catch (error) {
    console.log("Error executing command", error);
    return false;
  }
};
