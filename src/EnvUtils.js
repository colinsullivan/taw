export default function getOrError(envName) {
  var result = process.env[envName];

  if (result) {
    return result;
  } else {
    throw new Error(`env variable '${envName}' not defined`);
  }
}
