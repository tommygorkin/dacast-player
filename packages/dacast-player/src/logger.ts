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
      console.log('DACAST-PLAYER: ', ...args)
    }
  }

  warn(...args: unknown[]) {
    if (this._verbose) {
      console.warn('DACAST-PLAYER: ', ...args)
    }
  }

  error(...args: unknown[]) {
    if (this._verbose) {
      console.error('DACAST-PLAYER: ', ...args)
    }
  }
}

export const logger = new Logger()
