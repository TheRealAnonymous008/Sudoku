export default function composeClassnames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
  }