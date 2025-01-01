// table.d.ts
declare module "table" {
    type Border = {
      topBody: string;
      topJoin: string;
      topLeft: string;
      topRight: string;
      bottomBody: string;
      bottomJoin: string;
      bottomLeft: string;
      bottomRight: string;
      bodyLeft: string;
      bodyRight: string;
      bodyJoin: string;
      joinBody: string;
      joinLeft: string;
      joinRight: string;
      joinJoin: string;
    };
  
    interface TableConfig {
      border?: Border;
      columnDefault?: Record<string, any>;
      columns?: Record<number, any>;
      drawHorizontalLine?: (index: number, size: number) => boolean;
    }
  
    export function table(data: any[][], config?: TableConfig): string;
  }
  