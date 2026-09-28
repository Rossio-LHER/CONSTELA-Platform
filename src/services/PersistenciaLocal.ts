export class PersistenciaLocal {
  private static readonly KEY = "constela.playerProgress";

  public static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  }

  public static load<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error("Error leyendo localStorage:", error);
      return null;
    }
  }

  public static savePlayerProgress(data: unknown): void {
    this.save(this.KEY, data);
  }

  public static loadPlayerProgress(): unknown {
    return this.load(this.KEY);
  }

  public static clear(): void {
    localStorage.removeItem(this.KEY);
  }
}
