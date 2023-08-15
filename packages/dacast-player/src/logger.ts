class Logger {
  _verbose: boolean
  constructor(verbose: boolean = false) {
    this._verbose = verbose
  }

  verbose(verbose: boolean) {
    this._verbose = verbose
  }

  log(...args: unknown[]) {
    if (this._verbose) {
      console.log(...args)
    }
  }

  warn(...args: unknown[]) {
    if (this._verbose) {
      console.warn(...args)
    }
  }

  error(...args: unknown[]) {
    if (this._verbose) {
      console.error(...args)
    }
  }
}

export const logger = new Logger()
