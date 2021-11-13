const getTimeStamp = (): string => {
  return new Date().toISOString();
};

const log = (type: string, namespace: string, message: string, object?: any) => {
  if (object) {
    console.log(`[${getTimeStamp()}] [${type}] [${namespace}] ${message}`, object);
  } else {
    console.log(`[${getTimeStamp()}] [${type}] [${namespace}] ${message}`);
  }
};

const info = (namespace: string, message: string, object?: any) => {
  log("INFO", namespace, message, object);
};

const warn = (namespace: string, message: string, object?: any) => {
  log("WARN", namespace, message, object);
};

const error = (namespace: string, message: string, object?: any) => {
  log("ERROR", namespace, message, object);
};

const debug = (namespace: string, message: string, object?: any) => {
  log("DEBUG", namespace, message, object);
};

export default {
  info,
  warn,
  error,
  debug
};
