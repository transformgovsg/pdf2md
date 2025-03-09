import Arg from 'arg';
import dedent from 'dedent';

/**
 * Parses the command line arguments.
 *
 * @param argv - The command line arguments.
 * @param spec - The spec of the arguments.
 * @param stopAtPositional - Whether to stop at positional arguments.
 */
export function arg<T extends Arg.Spec>(
  argv: string[],
  spec: T,
  stopAtPositional = true,
): Arg.Result<T> {
  return Arg(spec, {
    ...argv,
    stopAtPositional,
  });
}

/**
 * Formats the input string by dedenting and trimming it.
 *
 * @param input - The input string to format.
 */
export function format(input = ''): string {
  return dedent(input).trim();
}
