import fs from "fs";

export const getEnvValue = (key: string) => {
  if (!fs.existsSync(".env")) return null;
  const envContent = fs.readFileSync(".env", "utf8").split("\n");
  const line = envContent.find(line => line.startsWith(`${key}=`))
  const value = line?.split("=")[1].trim()
  if (value) return decodeURIComponent(value);
  return null;
}

export const setEnvKey = (key: string, value: string) => {
  const envLine = `${key}=${encodeURIComponent(value)}`
  if (!fs.existsSync(".env")) {
    fs.writeFileSync('.env', envLine)
    return value
  }
  const envContent = fs.readFileSync(".env", "utf8").split("\n");
  const index = envContent.findIndex(line => line.startsWith(`${key}=`))
  if (index >= 0) envContent[index] = envLine
  else envContent.push(envLine)
  fs.writeFileSync(".env", envContent.join("\n").trim() + "\n")
  return value
}
