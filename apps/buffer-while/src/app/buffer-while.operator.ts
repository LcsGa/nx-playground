import { Observable, OperatorFunction } from 'rxjs';

export function bufferWhile<T>(predicate: (value: T, index: number) => boolean): OperatorFunction<T, T[]> {
  return (source) =>
    new Observable((destination) => {
      let index = 0;
      let buffer: T[] = [];

      return source.subscribe({
        next: (value) => {
          if (predicate(value, index++)) {
            buffer.push(value);
          } else {
            destination.next(buffer);
            buffer = [value];
          }
        },
        error: (err) => destination.error(err),
        complete: () => {
          destination.next(buffer);
          destination.complete();
        },
      });
    });
}
