// Types
export interface PrinterConfig {
  host: string;
  port: number;
}

export interface PrinterRequest {
  id: string
  commodity_id: string
  commodity_name: string
  vendor_id?: string
  vendor_name?: string
  code: string
}

// Composable
export function usePrinter() {
  const { setError } = useAlert()

  const printer = useState<PrinterConfig | null>('printer', () => null)
  const online = useState<boolean>('printer-online', () => false)

  // Load printer config from localStorage on init
  const loadPrinterConfig = () => {
    const stored = localStorage.getItem('printer-config')
    if (stored) {
      try {
        const config = JSON.parse(stored) as PrinterConfig
        if (config.host && config.port) {
          printer.value = config
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  // Set printer address
  const setPrinterConfig = (config: PrinterConfig) => {
    printer.value = config
    localStorage.setItem('printer-config', JSON.stringify(config))

    // Automatically check health after setting address
    checkPrinterConfig()
  }

  // Check printer health
  const checkPrinterConfig = async (): Promise<boolean> => {
    if (!printer.value) {
      return false
    }

    const url = `http://${printer.value.host}:${printer.value.port}/health`

    try {
      const response = await fetch(url);

      if (response.ok) {
        online.value = true
        return true
      }
      online.value = false
      return false
    } catch {
      online.value = false
      return false
    }
  }

  // Send print job
  const print = async (payload: PrinterRequest): Promise<boolean> => {
    if (!printer.value) {
      return false
    }

    // Check if printer is online first (if not checked recently)
    if (!online.value && !(await checkPrinterConfig())) { // 1 minute
      return false
    }

    const url = `http://${printer.value.host}:${printer.value.port}/print-qr`
    try {
      const response = await fetch(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      )

      if (response.ok) {
        const result = await response.json()

        if (result.status === 'ok') {
          return true
        } else {
          throw new Error(result.message || 'Print job failed')
        }
      } else {
        throw new Error(`Print request failed: ${response.statusText}`)
      }
    } catch (e) {
      setError(e)
      return false
    }
  }

  // Test print with sample data
  const printTest = async (): Promise<boolean> => {
    return print({
      id: `test-${Date.now()}`,
      commodity_id: 'TEST-001',
      commodity_name: 'Test Print',
      vendor_id: 'TEST',
      vendor_name: 'Test Vendor',
      code: `TEST-${new Date().toISOString()}`
    })
  }

  // Clear configuration
  const removePrinterConfig = () => {
    printer.value = null
    online.value = false
    localStorage.removeItem('printer-config')
  }

  return {
    // State
    printer,
    online,
    loadPrinterConfig,
    setPrinterConfig,
    checkPrinterConfig,
    removePrinterConfig,
    printTest,
    print,
  }
}