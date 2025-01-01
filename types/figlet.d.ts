declare module "figlet" {
  interface Fonts {
    [key: string]: string;
  }

  interface Options {
    font?: string; // Nazwa czcionki
    horizontalLayout?: "default" | "full" | "fitted" | "controlled smushing" | "universal smushing";
    verticalLayout?: "default" | "full" | "fitted" | "controlled smushing" | "universal smushing";
    width?: number; // Maksymalna szerokość
    whitespaceBreak?: boolean; // Czy łamać wiersze na białych znakach
  }

  interface Figlet {
    (text: string, options: Options, callback: (err: Error | null, data: string) => void): void;
    textSync(text: string, options?: Options): string;
    fonts(callback: (err: Error | null, fonts: string[]) => void): void;
    fontsSync(): string[];
    metadata(font: string, callback: (err: Error | null, options: any) => void): void;
  }

  const figlet: Figlet;

  export = figlet;
}
