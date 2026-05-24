import { dom } from './dom';
import type { PasswordOptions } from './types';

export function generatePassword(length: number, options: PasswordOptions): string {
  const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    number: '0123456789',
    symbol: '!@#$%^&*()_+~`|}{[]:;?><,./-='
  };

  let charset = '';
  if (options.upper) charset += chars.upper;
  if (options.lower) charset += chars.lower;
  if (options.number) charset += chars.number;
  if (options.symbol) charset += chars.symbol;
  if (!charset) return '';

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, value => charset[value % charset.length]).join('');
}

export function runGenerator(): void {
  const options = {
    upper: dom.gen.chkUpper.checked,
    lower: dom.gen.chkLower.checked,
    number: dom.gen.chkNumber.checked,
    symbol: dom.gen.chkSymbol.checked
  };

  if (!options.upper && !options.lower && !options.number && !options.symbol) {
    dom.gen.result.textContent = '请至少选择一种字符';
    return;
  }

  dom.gen.result.textContent = generatePassword(Number.parseInt(dom.gen.lengthSlider.value, 10), options);
}
